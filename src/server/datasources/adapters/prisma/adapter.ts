import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import type { IDataSourceAdapter } from "../../ports";
import { db as dbClient } from "./db";
import type { Prisma } from "@prisma/client";
import { normalizeText } from "~/lib/normalize";
import type { Page } from "~/models/pagination";
import type { PokemonListFilter } from "~/models/filters";

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

    async findAllPokemons(filters: PokemonListFilter): Promise<Page<PokemonRelations<Pokemon, "generation" | "types"> & PokemonSearch>> {
        const where: Prisma.PokemonWhereInput = {}
        const queryName = filters.name?.trim();

        const request = async (): Promise<Page<PokemonRelations<Pokemon, "generation" | "types"> & PokemonSearch>> => {
            const [count, rawPokemons] = await this.db.$transaction([
                this.db.pokemon.count({ where }),
                this.db.pokemon.findMany({
                    where,
                    include: {
                        generation: true,
                        types: {
                            include: {
                                pokemonType: true,
                            }
                        },
                    },
                    skip: filters.offset,
                    take: filters.limit,
                    orderBy: {
                        id: 'asc'
                    }
                })
            ]);

            const pokemons = rawPokemons.map((pokemon): PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch => ({
                ...pokemon,
                types: pokemon.types.map(t => t.pokemonType),
            }));

            return {
                count,
                currentPage: Math.floor(filters.offset / filters.limit) + 1,
                data: pokemons,
                isLast: filters.offset + pokemons.length >= count,
            }
        }

        if (filters.type) {
            where.types = {
                some: {
                    pokemonType: {
                        handle: filters.type,
                    }
                }
            }
        }

        if (filters.generation) {
            where.generation = {
                handle: filters.generation,
            }
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
            ];

            const requestData = await request();
            requestData.data.forEach((pokemon) => {
                pokemon.searchMatch = pokemonIdsSet.has(pokemon.id) ? 'contains' : 'evolution';
            });

            return requestData;
        }

        return await request();
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