import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const mainRouter = createTRPCRouter({
  whatsnew: publicProcedure.query(async () => {
    try {
      const res = await prisma.whatsnew.findMany({
        orderBy: {
          id: "asc",
        },
        take: 3,
      });
      return res;
    } catch (error) {
      console.error("🚀whatsnew:publicProcedure.query", error);
      return [];
    }
  }),
});
