import * as argon2 from "argon2";
import { signInSchema, signUpSchema, verifyEmailSchema } from "~/input_types";
import * as jwt  from "jsonwebtoken"
import cookie from 'cookie'

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { cookies } from "next/headers";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ctx, input }) => {
      const pwdHash = await argon2.hash(input.password)
      const user = await ctx.db.user.upsert({
        create: {
          name: input.name,
          email: input.email,
          password: pwdHash,
        },
        update: {},
        where: {
          email: input.email
        }
      })
      const cur = new Date()
      const tokenExpiry = new Date(cur.setHours(cur.getHours() + 2))
      await ctx.db.verification.create({
        data: {
          token: (Math.floor(Math.random()*90000000) + 10000000).toString(),
          userId: user.id,
          expiresAt: tokenExpiry
        }
      })
      return { id: user.id, isEmailVerified: false}
    }),

  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        }
      })
      if (!user) {
        throw new Error("Invalid username/password")
      }

      const valid = await argon2.verify(user.password, input.password)
      if(!valid){
        throw new Error("Invalid username/password")
      }

      const { id, isEmailVerified } = user
      if(!isEmailVerified) {
        return {id, isEmailVerified}
      }
      const jwtToken = jwt.sign({userId: id}, process.env.JWT_SECRET ?? "SECRET",  {expiresIn: 60*60*24*365})

      return { token: jwtToken, isEmailVerified: isEmailVerified } 
    }),

    verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ctx, input,  }) => {
      const latestVerf = await ctx.db.verification.findFirst({
        where : {
          userId: input.userId,
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      if(!latestVerf) {
        throw new Error("Verification procedure did not initiate")
      }

      if(latestVerf.token !== input.token) {
        throw new Error("Invalid verification token")
      }

      await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isEmailVerified: true,
        },
      })

      const jwtToken = jwt.sign({userId: input.userId}, process.env.JWT_SECRET ?? "SECRET",  {expiresIn: 60*60*24*365})

      return { token: jwtToken, isEmailVerified: true}
    })
});
