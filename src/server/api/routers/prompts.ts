import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Client } from "@notionhq/client";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
const notion = new Client({
  auth: env.NOTION_API_KEY,
});

export const promptsRouter = createTRPCRouter({
  prompts: publicProcedure
    .input(z.object({ prompts: z.array(z.string()) }))
    .mutation(async ({ input: { prompts } }) => {
      const res = await prisma.prompt.findMany({
        where: { tags: { hasEvery: prompts } },
      });
      return res;
    }),
  tags: publicProcedure.query(async () => {
    const response = await notion.databases.query({
      database_id: env.NOTION_TAGS_DB_ID,
      filter: {
        property: "Tags",
        multi_select: { is_not_empty: true },
      },
    });
    const tags = response.results.map((o) =>
      // @ts-expect-error wrong
      o.properties.Tags.multi_select.map((ob) => ob.name).flat()
    );
    return [...new Set(tags.flat())] as string[];
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
