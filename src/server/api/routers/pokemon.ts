import { z } from "zod";
import { normalizeText } from "~/lib/normalize";
import type { Pokemon, PokemonRelations } from "~/models/pokemon";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Prisma } from '@prisma/client'


const pokemonRouter = createTRPCRouter({
  findAll: publicProcedure
  .input(z.object({ name: z.string().optional() }).optional())
  .query<Array<PokemonRelations<Pokemon, 'generation' | 'types'>>>(async ({ctx, input}) => {
    let where: Prisma.PokemonScalarWhereInput = {}
    if (input?.name) {
      where.nameSearch = {
        contains: normalizeText(input.name)
      }
    }

    return await ctx.db.pokemon.findMany({
      where,
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