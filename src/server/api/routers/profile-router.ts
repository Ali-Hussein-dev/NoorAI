import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      let userProfile = await prisma.profile.findFirst({
        where: { userId: id },
      });

      if (!userProfile) {
        userProfile = await prisma.profile.create({
          data: { userId: id, tier: "free" },
        });
        console.log("created user profile");
      }
      return userProfile;
    }),
});
