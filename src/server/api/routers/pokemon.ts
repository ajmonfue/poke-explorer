import { z } from "zod";
import type { Pokemon, PokemonRelations } from "~/models/pokemon";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const pokemonRouter = createTRPCRouter({
  findAll: publicProcedure.query<Array<PokemonRelations<Pokemon, 'generation' | 'types'>>>(async ({ctx}) => {
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

  findById: publicProcedure
    .input(z.object({ id: z.number() })) 
    .query<PokemonRelations<Pokemon, 'generation' | 'types'> | null>(async ({ ctx, input }) => {
      const post = await ctx.db.pokemon.findUnique({
        where: {
          id: input.id,
        },
        include: {
          generation: true,
          types: {
            include: {
              pokemonType: true,
            }
          },
        }
      });

      return post ?? null;
    }),
});

export default pokemonRouter;