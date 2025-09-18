import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import type { IDataSourceAdapter } from "../../ports";
import { db as dbClient } from "./db";
import type { Prisma } from "@prisma/client";
import { normalizeText } from "~/lib/normalize";

export class PrismaDataSource implements IDataSourceAdapter {
    private readonly db = dbClient;

    async findEvolutions(evolutionLines: Array<string>): Promise<Array<Pokemon>> {
        return await this.db.pokemon.findMany({
            where: {
                evolutionLines: { hasSome: evolutionLines },
            },
            orderBy: {
                evolutionStage: 'asc'
            }
        });
    }

    async findAllPokemons(filters: { name?: string; }): Promise<Array<PokemonRelations<Pokemon, "generation" | "types"> & PokemonSearch>> {
        const where: Prisma.PokemonScalarWhereInput = {}
        const queryName = filters.name?.trim();

        const findAllRequest = async () => {
            return await this.db.pokemon.findMany({
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

            const pokemonsMatched = await this.db.pokemon.findMany({
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

            return (await findAllRequest())
                .map((pokemon): PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch => {
                    return {
                        ...pokemon,
                        types: pokemon.types.map(t => t.pokemonType),
                        searchMatch: pokemonIdsSet.has(pokemon.id) ? 'contains' : 'evolution'
                    }
                })
        }

        return (await findAllRequest())
            .map((pokemon): PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch => {
                return {
                    ...pokemon,
                    types: pokemon.types.map(t => t.pokemonType),
                }
            })
    }

    async findPokemonById(id: number): Promise<PokemonRelations<Pokemon, "generation" | "types"> | null> {
        const pokemon = await this.db.pokemon.findUnique({
            where: {
                id,
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
        
        return pokemon != null ? {
            ...pokemon,
            types: pokemon.types.map(t => t.pokemonType),
        } : null
    }

}