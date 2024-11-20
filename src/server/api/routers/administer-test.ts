import { ComputerAdaptiveTest, TestStateSchema } from "@/lib/cat";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const testRouter = createTRPCRouter({
  getNextQuestion: publicProcedure
    .input(TestStateSchema)
    .mutation(({ input }) => {
      const cat = new ComputerAdaptiveTest(input);
      const { itemBank, ...rest } = input;
      console.log("State: ", rest);
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

  processResponse: publicProcedure
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
});
