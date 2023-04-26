import { createTRPCRouter } from "~/server/api/trpc";
import { promptsRouter } from "~/server/api/routers/prompts-router";
import { profileRouter } from "./routers/profile-router";
import { mainRouter } from "./routers/main-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  prompts: promptsRouter,
  profile: profileRouter,
  main: mainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
