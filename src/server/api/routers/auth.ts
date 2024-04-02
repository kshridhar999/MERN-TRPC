import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import {
  resendVerfEmailSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from "~/input_types";
import emailjs from "../../email";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { z } from "zod";
import { EmailJSResponseStatus } from "@emailjs/nodejs";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const pwdHash = await argon2.hash(input.password);
      const user = await ctx.db.user.upsert({
        create: {
          name: input.name,
          email: input.email,
          password: pwdHash,
        },
        update: {},
        where: {
          email: input.email,
        },
      });
      const cur = new Date();
      const tokenExpiry = new Date(cur.setHours(cur.getHours() + 2));
      const verfToken = (
        Math.floor(Math.random() * 90000000) + 10000000
      ).toString();
      const verf = await ctx.db.verification.create({
        data: {
          token: verfToken,
          userId: user.id,
          expiresAt: tokenExpiry,
        },
      });

      const templateParams = {
        service: "Mern Trpc Project",
        to_name: user.name,
        verification_token: verfToken,
        expiration_hours: 2,
        to_email: user.email,
      };

      try {
        await emailjs.send(
          env.EMAILER_SERVICE_ID,
          env.EMAILER_VERIFICATION_TEMPLATE_ID,
          templateParams,
        );
      } catch (e) {
        if (e instanceof EmailJSResponseStatus) {
          throw new Error("Emailer Error: " + e.text);
        }
        throw new Error("Emailer Error");
      }
      return { verfId: verf.id, isEmailVerified: false };
    }),

  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        throw new Error("Invalid username/password");
      }

      const valid = await argon2.verify(user.password, input.password);
      if (!valid) {
        throw new Error("Invalid username/password");
      }

      const { id, isEmailVerified } = user;
      if (!isEmailVerified) {
        return { id, isEmailVerified };
      }
      const jwtToken = jwt.sign(
        { userId: id },
        process.env.JWT_SECRET ?? "SECRET",
        { expiresIn: 60 * 60 * 24 * 365 },
      );

      return { token: jwtToken, isEmailVerified: isEmailVerified };
    }),

  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const latestVerf = await ctx.db.verification.findFirst({
        where: {
          userId: input.userId,
          id: input.vid,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!latestVerf) {
        throw new Error("Verification procedure did not initiate");
      }

      if (latestVerf.token !== input.token) {
        throw new Error("Invalid verification token");
      }

      if (latestVerf.expiresAt < new Date()) {
        throw new Error("Verification token has expired");
      }

      await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isEmailVerified: true,
        },
      });

      const jwtToken = jwt.sign(
        { userId: input.userId },
        process.env.JWT_SECRET ?? "SECRET",
        { expiresIn: 60 * 60 * 24 * 365 },
      );

      return { token: jwtToken, isEmailVerified: true };
    }),

  resendVerificationEmail: publicProcedure
    .input(resendVerfEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const [latestVerf, user] = await Promise.all([
        ctx.db.verification.findFirst({
          where: {
            userId: input.userId,
            id: input.vid,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        ctx.db.user.findFirst({
          where: {
            id: input.userId,
            Verification: {
              some: {
                id: input.vid,
              },
            },
          },
        }),
      ]);
      if (!user) {
        throw new Error("No such user is present");
      }
      if (!latestVerf) {
        const cur = new Date();
        const tokenExpiry = new Date(cur.setHours(cur.getHours() + 2));
        const verfToken = (
          Math.floor(Math.random() * 90000000) + 10000000
        ).toString();
        const verf = await ctx.db.verification.create({
          data: {
            token: verfToken,
            userId: user.id,
            expiresAt: tokenExpiry,
          },
        });
        const templateParams = {
          service: "Mern Trpc Project",
          to_name: user.name,
          verification_token: verfToken,
          expiration_hours: 2,
          to_email: user.email,
        };

        await emailjs.send(
          env.EMAILER_SERVICE_ID,
          env.EMAILER_VERIFICATION_TEMPLATE_ID,
          templateParams,
        );
        return { verfId: verf.id, isEmailVerified: false, reactivationIn: 35 };
      }
      const curTime = new Date();
      const reactivationTime = new Date(
        latestVerf.createdAt.setSeconds(latestVerf.createdAt.getSeconds() + 35),
      );
      if (reactivationTime > curTime) {
        throw new Error(
          "Please wait " +
            (reactivationTime.getSeconds() - curTime.getSeconds()) +
            " seconds before resending the verification email",
        );
      }
      const verfToken = (
        Math.floor(Math.random() * 90000000) + 10000000
      ).toString();

      const tokenExpiry = new Date(curTime.setHours(curTime.getHours() + 2));
      const verf = await ctx.db.verification.create({
        data: {
          token: verfToken,
          userId: user.id,
          expiresAt: tokenExpiry,
        },
      });

      const templateParams = {
        service: "Mern Trpc Project",
        to_name: user.name,
        verification_token: verfToken,
        expiration_hours: 2,
        to_email: user.email,
      };

      await emailjs.send(
        env.EMAILER_SERVICE_ID,
        env.EMAILER_VERIFICATION_TEMPLATE_ID,
        templateParams,
      );
      return { verfId: verf.id, isEmailVerified: false, reactivationIn: 35 };
    }),
});
