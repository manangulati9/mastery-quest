import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { userStats } from "@/server/db/schema";
import { createProfileSchema } from "@/zod_schemas";

export const accountRouter = createTRPCRouter({
  createUserStats: protectedProcedure
    .input(createProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const newUserStats = {
        id: ctx.session.user.id,
        grade: Number.parseInt(input.grade),
      } satisfies typeof userStats.$inferInsert;

      await ctx.db.insert(userStats).values(newUserStats);
    }),
});
