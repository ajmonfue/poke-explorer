import type { Generation } from "~/models/generation";
import { createTRPCRouter, publicProcedure } from "../trpc";

const router = createTRPCRouter({
    findAll: publicProcedure
        .query<Array<Generation>>(async ({ctx}) => {
            return ctx.datasource.findGenerations();
        })
});

export default router;