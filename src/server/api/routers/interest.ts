import { z } from "zod";
import { getAllInterestsSchema } from "~/input_types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const interestRouter = createTRPCRouter({
  toggleInterest: protectedProcedure
    .input(
      z.object({ interestId: z.string(), isSaved: z.boolean().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.userInterest.upsert({
        create: {
          userId: ctx.session.userId,
          interestId: input.interestId,
        },
        update: {
          isSaved: input.isSaved ?? false,
        },
        where: {
          interestId_userId: {
            userId: ctx.session.userId,
            interestId: input.interestId,
          },
        },
      });
    }),
  getAllInterests: protectedProcedure
    .input(getAllInterestsSchema)
    .query(async ({ ctx, input }) => {
      const page = input.pagination?.page ?? 0;
      const limit = input.pagination?.limit ?? 6;

      const [interests, total] = await Promise.all([
        ctx.db.interest.findMany({
          select: {
            id: true,
            name: true,
            userInterest: true,
          },
          take: limit,
          skip: page * limit,
        }),
        ctx.db.interest.count(),
      ]);

      return {
        data: interests.map((interest) => ({
          id: interest.id,
          name: interest.name,
          isSaved:
            interest.userInterest.length !== 0 &&
            interest.userInterest.find(
              (userInt) => userInt.userId === ctx.session.userId,
            )?.isSaved,
        })),
        paginationData: {
          total: total,
        },
      };
    }),
});
