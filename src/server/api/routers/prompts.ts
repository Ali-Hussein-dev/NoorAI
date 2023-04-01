import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const promptsRouter = createTRPCRouter({
  prompts: publicProcedure
    .input(z.object({ tags: z.array(z.string()) }))
    .mutation(async ({ input: { tags: prompts } }) => {
      const res = await prisma.prompt.findMany({
        where: { tags: { hasEvery: prompts } },
      });
      return res;
    }),
  tags: publicProcedure.query(async () => {
    const res = await prisma.prompt.findMany({ select: { tags: true } });
    const values = Object.values(res).map((o) => o.tags);
    const tags = [...new Set(values.flat())].sort();
    return tags;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
