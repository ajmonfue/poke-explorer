import { z } from "zod";
import type { Pokemon, PokemonEvolvable, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const pokemonRouter = createTRPCRouter({
  findEvolutions: publicProcedure
    .input(z.object({ evolutionLines: z.string().array() }))
    .query<Array<Pokemon>>(async ({ ctx, input }) => {
      return await ctx.datasource.findEvolutions(input.evolutionLines);
    }),

  findAll: publicProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query<Array<PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch>>(async ({ ctx, input }) => {
      return await ctx.datasource.findAllPokemons(input ?? {});
    }),

  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query<PokemonRelations<Pokemon, 'generation' | 'types'> | null>(async ({ ctx, input }) => {
      return await ctx.datasource.findPokemonById(input.id);
    }),
});

export default pokemonRouter;