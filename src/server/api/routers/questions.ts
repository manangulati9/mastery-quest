import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { questions } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export const questionsRouter = createTRPCRouter({
  getQuestions: publicProcedure.query(async ({ ctx }) => {
    const questionsArray = await ctx.db
      .select()
      .from(questions)
      .orderBy(sql`RANDOM()`);
    return questionsArray;
  }),
});
