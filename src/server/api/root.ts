import { createTRPCRouter } from "~/server/api/trpc";
import { promptsRouter } from "~/server/api/routers/prompts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  prompts: promptsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
