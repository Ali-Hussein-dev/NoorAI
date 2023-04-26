import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

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
    // return tags array
    return [...new Set(values.flat())].sort();
  }),
  popularity: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const res = await prisma.prompt.updateMany({
        where: { id: input.id },
        data: {
          popularity: { increment: 1 },
        },
      });

      return res.count > 0 ? { ok: true } : { ok: false };
    }),
});
