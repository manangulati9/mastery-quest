import { questionsRouter } from "@/server/api/routers/questions";
import { testRouter } from "@/server/api/routers/administer-test";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { userDataRouter } from "./routers/account";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  questions: questionsRouter,
  administerTest: testRouter,
  userData: userDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
