import { z } from "zod";
import { normalizeText } from "~/lib/normalize";
import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Prisma } from '@prisma/client'


const pokemonRouter = createTRPCRouter({
  findEvolutions: publicProcedure
    .input(z.object({ evolutionLines: z.string().array() }))
    .query<Array<Pokemon>>(async ({ ctx, input }) => {
      return await ctx.db.pokemon.findMany({
        where: {
          evolutionLines: { hasSome: input.evolutionLines },
        },
        orderBy: {
          evolutionStage: 'asc'
        }
      })
    }),

  findAll: publicProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query<Array<PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch>>(async ({ ctx, input }) => {
      const where: Prisma.PokemonScalarWhereInput = {}
      const queryName = input?.name?.trim();

      const findAllRequest = async () => {
        return await ctx.db.pokemon.findMany({
          where,
          include: {
            generation: true,
            types: {
              include: {
                pokemonType: true,
              }
            },
          },
          orderBy: {
            id: 'asc'
          }
        });
      }

      if (queryName) {
        const paramName = normalizeText(queryName);

        const pokemonsMatched = await ctx.db.pokemon.findMany({
          where: { name: { contains: paramName, mode: "insensitive" } },
          select: {
            evolutionLines: true,
            id: true
          },
        });

        const evolutionLinesSet = new Set(pokemonsMatched.flatMap(pokemon => pokemon.evolutionLines));
        const pokemonIdsSet = new Set(pokemonsMatched.map(pokemon => pokemon.id));

        where.OR = [
          {
            id: {
              in: Array.from(pokemonIdsSet),
            },
          },
          { evolutionLines: { hasSome: Array.from(evolutionLinesSet) } },
        ]

        const pokemonsAndEvolutions = await findAllRequest();
        return pokemonsAndEvolutions
          .map((pokemon): PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch => {
            return {
              ...pokemon,
              searchMatch: pokemonIdsSet.has(pokemon.id) ? 'contains' : 'evolution'
            }
          })
      }

      return await findAllRequest();
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