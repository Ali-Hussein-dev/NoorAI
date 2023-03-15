import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Client } from "@notionhq/client";
import { env } from "~/env.mjs";

const notion = new Client({
  auth: env.NOTION_API_KEY,
});

export const promptsRouter = createTRPCRouter({
  prompts: publicProcedure
    .input(z.object({ prompts: z.array(z.string()) }))
    .mutation(async ({ input: { prompts } }) => {
      const response = await notion.databases.query({
        database_id: env.NOTION_TAGS_DB_ID,
        filter: {
          and: prompts.map((p) => ({
            property: "Tags",
            multi_select: { contains: p },
          })),
          property: "Name",
          title: { is_not_empty: true },
        },
      });
      const list = response.results.map((o) => ({
        // @ts-expect-error type is correct
        text: o?.properties?.Name?.title[0]?.plain_text,
        // @ts-expect-error type is correct
        tags: o?.properties?.Tags?.multi_select,
        id: o.id,
      }));
      return list;
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
