import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  isAuthorized: publicProcedure
    .query(async ({ ctx }) => {
        return {isAuthorized: !!ctx.session.user}
    }),
    getUser: protectedProcedure
    .query(({ctx})=> {
      if(!ctx.session.user){
        throw new Error("Please login to get user")
      }
      return ctx.session.user
    }),
    getUserLead: publicProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input})=> {
      const user = await ctx.db.user.findFirst(
        {
          where: {
            id: input.id,
          }
        }
      )
      if(!user){
        throw new Error("User not found")
      }

      return {email: user.email, name: user.name, id: user.id}
    })
});
