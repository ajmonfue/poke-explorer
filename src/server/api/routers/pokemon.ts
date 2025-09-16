import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const pokemonRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ctx}) => {
    return await ctx.db.pokemon.findMany({
      include: {
        generation: true,
        types: {
          include: {
            pokemonType: true,
          }
        },
      }
    });
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pokemon.create({
        data: {
          name: input.name,
          description: '',
          generationId: 0,
          imageUrl: '',
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.pokemon.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),
});

export default pokemonRouter;