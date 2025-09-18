import { createTRPCRouter, publicProcedure } from "../trpc";
import type { PokemonType } from "~/models/pokemon-type";

const router = createTRPCRouter({
    findAll: publicProcedure
        .query<Array<PokemonType>>(async ({ctx}) => {
            return ctx.datasource.findPokemonTypes();
        })
});

export default router;