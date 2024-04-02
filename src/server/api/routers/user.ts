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
  }),
  getUserLead: publicProcedure
    .input(z.object({ id: z.string().optional(), vid: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.vid) {
        const latestVerfUser = await ctx.db.verification.findFirst({
          where: {
            id: input.vid,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            user: true,
          },
        });
        if (!latestVerfUser) {
          throw new Error("Verification procedure did not initiate");
        }
        const { email, name, id } = latestVerfUser.user;

        return { id, name, email };
      }

      const user = await ctx.db.user.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }

      return { email: user.email, name: user.name, id: user.id };
    }),
});
