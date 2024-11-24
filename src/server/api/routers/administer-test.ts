import { ComputerAdaptiveTest, TestStateSchema } from "@/lib/cat";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { tests, userStats } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

export const testRouter = createTRPCRouter({
  getNextQuestion: protectedProcedure
    .input(TestStateSchema)
    .mutation(({ input }) => {
      const cat = new ComputerAdaptiveTest(input);
      const question = cat.getNextQuestion();
      const state = cat.getState();

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Unable to fetch next question",
        });
      }

      return { question, state };
    }),

  processResponse: protectedProcedure
    .input(
      z.object({
        state: TestStateSchema,
        response: z.object({
          questionId: z.coerce.number(),
          selectedAnswer: z.string(),
        }),
      }),
    )
    .mutation(({ input }) => {
      const cat = new ComputerAdaptiveTest(input.state);
      cat.processResponse(
        input.response.questionId,
        input.response.selectedAnswer,
      );
      const state = cat.getState();
      return state;
    }),

  submitTest: protectedProcedure
    .input(
      z.object({
        subject: z.string(),
        totalQuestions: z.number(),
        score: z.number(),
        totalTests: z.number(),
        average: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await Promise.all([
        ctx.db.insert(tests).values({
          id: nanoid(),
          userId: ctx.auth.userId,
          subject: input.subject,
          score: input.score,
          totalQuestions: input.totalQuestions,
        }),
        ctx.db
          .update(userStats)
          .set({
            averageScore: (
              (input.average * input.totalTests + input.score) /
              (input.totalTests + 1)
            ).toFixed(2),
            totalTestsTaken: input.totalTests + 1,
          })
          .where(eq(userStats.id, ctx.auth.userId)),
      ]);
    }),
});
