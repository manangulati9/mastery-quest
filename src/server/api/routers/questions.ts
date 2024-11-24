import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { questions } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export const questionsRouter = createTRPCRouter({
  getQuestions: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const questionsArray = await ctx.db
        .select()
        .from(questions)
        .where(eq(questions.subject, input))
        .orderBy(sql`RANDOM()`);
      return questionsArray;
    }),
});
