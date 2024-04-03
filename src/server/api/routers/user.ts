import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  isAuthorized: publicProcedure.query(async ({ ctx }) => {
    return { isAuthorized: !!ctx.session.sessionUserId };
  }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findFirst({
        where: {
          id: ctx.session.userId,
        },
        select: {
          email: true,
          id: true,
          name: true,
        },
      });
      return { user };
    } catch (e) {
      throw e;
    }
  }),
  getUserLead: publicProcedure
    .input(z.object({ id: z.string().optional(), vid: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.vid) {
        let latestVerfUser;
        try {
          latestVerfUser = await ctx.db.verification.findFirst({
            where: {
              id: input.vid,
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              user: {
                select: {
                  email: true,
                  id: true,
                  name: true,
                },
              },
            },
          });
        } catch (e) {
          throw e;
        }
        if (!latestVerfUser) {
          throw new Error("Verification procedure did not initiate");
        }
        const { email, name, id } = latestVerfUser.user;

        return { id, name, email };
      }

      let user;
      try {
        user = await ctx.db.user.findFirst({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            email: true,
            name: true,
          },
        });
      } catch (e) {
        throw e;
      }
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),
});
