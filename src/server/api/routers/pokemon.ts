import { z } from "zod";
import type { Page } from "~/models/pagination";
import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const router = createTRPCRouter({
  findEvolutions: publicProcedure
    .input(z.object({ evolutionLines: z.string().array() }))
    .query<Array<Pokemon>>(async ({ ctx, input }) => {
      return await ctx.datasource.findEvolutions(input.evolutionLines);
    }),

  findAll: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      type: z.string().optional(),
      generation: z.string().optional(),
      limit: z.number(),
      offset: z.number()
    }))
    .query<Page<PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch>>(async ({ ctx, input }) => {
      return await ctx.datasource.findPokemons(input);
    }),

  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query<PokemonRelations<Pokemon, 'generation' | 'types'> | null>(async ({ ctx, input }) => {
      return await ctx.datasource.findPokemon(input.id);
    }),
});

export default router;