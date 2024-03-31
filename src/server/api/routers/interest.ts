
import { z } from "zod";
import { getAllInterestsSchema } from "~/input_types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const interestRouter = createTRPCRouter({
  toggleInterest: protectedProcedure
    .input(z.object({ interestId: z.string()}))
    .mutation(async ({ctx, input }) => {
      const user = ctx.session.user;

      if(!user){
        throw new Error("Please login to save interest");
      }
      await ctx.db.userInterest.upsert({
        create: {
          userId: user.id,
          interestId: input.interestId,
        },
        update: {
          isSaved: false
        },
        where: {
          interestId_userId: {userId: user.id, interestId: input.interestId}
        }
      })
    }),
    getAllInterests: protectedProcedure
    .input(getAllInterestsSchema)
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user

      if(!user){
        throw new Error("Please login to get all saved interests")
      }
      
      const page = input.pagination?.page ?? 1
      const limit = input.pagination?.limit?? 6

      const [interests, total] = await Promise.all([ctx.db.interest.findMany({
        select: {
          id: true,
          name: true,
          userInterest: true
        },
        take: limit,
        skip: page*limit
      }), ctx.db.interest.count()])

      return {data: interests.map(interest => ({
        id: interest.id,
        name: interest.name,
        isSaved: interest.userInterest.length !== 0 && interest.userInterest.find((userInt)=> userInt.userId === user.id)?.isSaved
      })), paginationData: {
        total: total,
      }}
    }),
});
