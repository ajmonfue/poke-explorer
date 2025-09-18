import pokemonRouter from "~/server/api/routers/pokemon";
import generationRouter from '~/server/api/routers/generation';
import pokemonTypeRouter from '~/server/api/routers/pokemon-type';
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pokemon: pokemonRouter,
  generation: generationRouter,
  pokemonType: pokemonTypeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
