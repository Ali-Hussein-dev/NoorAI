import { createTRPCRouter } from "~/server/api/trpc";
import { promptsRouter } from "~/server/api/routers/prompts";
import { profileRouter } from "./routers/profile-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  prompts: promptsRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
