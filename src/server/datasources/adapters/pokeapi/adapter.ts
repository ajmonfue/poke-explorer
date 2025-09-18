import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import type { IDataSourceAdapter } from "../../ports";
import type { PokeApiApiList } from "./types/api";
import { type PokeApiPokemon, type PokeApiPokemonListItem, PokeApiPokemonStat } from "./types/pokemon";
import type { PokemonType } from "~/models/pokemon-type";
import type { PokeApiType, PokeApiTypeListItem } from "./types/type";
import type { PokeApiPokemonSpecie } from "./types/specie";
import type { PokeApiEvolution, PokeApiEvolutionChain } from "./types/evolution-chain";
import type { PokeApiGeneration, PokeApiGenerationListItem } from "./types/generation";
import { normalizeText } from "~/lib/normalize";
import type { Page } from "~/models/pagination";
import type { PokemonListFilter } from "~/models/filters";
import type { Generation } from "~/models/generation";

export class PokeApiDataSource implements IDataSourceAdapter {
    private readonly baseUrl = 'https://pokeapi.co/api/v2';
    private readonly language = 'en';
    private readonly pokemonsCachekey = 'pokemons';
    private _cache = new Map<string, { data: any; timestamp: number }>()
    private readonly CACHE_DURATION = 5 * 60 * 1000;

    private async cache<T>(key: string, callback: () => Promise<T>, cacheDuration: number = this.CACHE_DURATION): Promise<T> {
        const cached = this._cache.get(key);
        if (cached && (cacheDuration == 0 || (Date.now() - cached.timestamp) < cacheDuration)) {
            return cached.data
        }

        const data = await callback();
        this._cache.set(key, { data, timestamp: Date.now() })
        return data;
    }

    private async fetchWithCache<T>(url: string, cacheDuration: number = this.CACHE_DURATION): Promise<T> {
        return await this.cache(url, async () => await this.fetch<T>(url), cacheDuration);
    }

    private async fetch<T>(url: string) {
        const response = await fetch(url);
        if (response.status != 200) {
            throw new Error(`error fetching ${url}`);
        }
        return await response.json() as T;
    }

    async findEvolutions(evolutionLines: Array<string>): Promise<Array<Pokemon>> {
        const pokemons = await this.cache(this.pokemonsCachekey, () => this.getAllPokemons(), 0);
        const filteredPokemons = pokemons
        .filter(pokemon => {
            return pokemon.evolutionLines.some(line => evolutionLines.includes(line))
        });

        filteredPokemons.sort((a, b) => a.evolutionStage - b.evolutionStage);
        return filteredPokemons;
    }

    private async getPokemonTypes(): Promise<Array<PokemonType>> {
        const listResponse = await this.fetchWithCache<PokeApiApiList<PokeApiTypeListItem>>(`${this.baseUrl}/type`);
        return await Promise.all(listResponse.results.map(item => this.fetchWithCache<PokeApiType>(item.url)))
            .then(apiGenerations => apiGenerations.map(apiItem => ({
                handle: apiItem.name,
                name: apiItem.names.find(n => n.language.name == this.language)?.name ?? apiItem.name,
                id: apiItem.id,
            })));
    }

    private async getGenerations(): Promise<Array<Generation>> {
        const listResponse = await this.fetchWithCache<PokeApiApiList<PokeApiGenerationListItem>>(`${this.baseUrl}/generation`);
        return await Promise.all(listResponse.results.map(item => this.fetchWithCache<PokeApiGeneration>(item.url)))
            .then(apiGenerations => apiGenerations.map(apiItem => ({
                handle: apiItem.name,
                name: apiItem.names.find(n => n.language.name == this.language)?.name ?? apiItem.name,
                id: apiItem.id,
            })));
    }

    private getEvolutionLines(pokemonToFound: string, lines: Array<string>, node: {evolution: PokeApiEvolution, siblings: number, stage: number}): number | null {
        const { evolution, siblings, stage } = node;
        if (node.evolution.species.name === pokemonToFound) {
            if (siblings > 1) lines.push(evolution.species.name);
            return stage;
        }
        for (let evolvesTo of node.evolution.evolves_to) {
            const stageFound = this.getEvolutionLines(
                pokemonToFound,
                lines,
                {
                    evolution: evolvesTo,
                    siblings: node.evolution.evolves_to.length,
                    stage: node.stage + 1
                },
            )
            if (stageFound !== null) {
                if (siblings > 1) lines.push(evolution.species.name);
                return stageFound;
            }
        }

        return null;
    }

    private async getAllPokemons(): Promise<Array<PokemonRelations<Pokemon, "generation" | "types">>> {
        const typesMap = (await this.getPokemonTypes()).reduce((map, item) => {
            map.set(item.handle, item);
            return map;
        }, new Map<string, PokemonType>());

        const generationsMap = (await this.getGenerations()).reduce((map, item) => {
            map.set(item.handle, item);
            return map;
        }, new Map<string, Generation>());


        const pokemonListResponse = await this.fetchWithCache<PokeApiApiList<PokeApiPokemonListItem>>(`${this.baseUrl}/pokemon?limit=10000&offset=0`);
        
        const apiPokemonsData = await Promise.all(
            pokemonListResponse.results.map(async (pokemonListItem) => {
                const pokemon = await this.fetchWithCache<PokeApiPokemon>(pokemonListItem.url);
                const specie = await this.fetchWithCache<PokeApiPokemonSpecie>(pokemon.species.url);

                return {
                    pokemon,
                    specie,
                    evolutionChain: await this.fetchWithCache<PokeApiEvolutionChain>(specie.evolution_chain.url),
                }
            })
        );
        
        return apiPokemonsData
        .map(({pokemon: apiPokemon, specie, evolutionChain}): PokemonRelations<Pokemon, "generation" | "types"> => {
            const description = specie.flavor_text_entries.find(entry => entry.language.name == this.language)?.flavor_text ?? '';
            const lines: Array<string> = []
            const evolutionStage = this.getEvolutionLines(
                apiPokemon.name,
                lines,
                {
                    evolution: evolutionChain.chain,
                    siblings: 1,
                    stage: 1,
                },
            );
            
            if (evolutionStage) {
                lines.push(evolutionChain.chain.species.name);
                lines.reverse();
            }

            const pokemonGeneration = generationsMap.get(specie.generation.name)!;
            return {
                name: specie.names.find(n => n.language.name == this.language)?.name ?? apiPokemon.name,
                imageUrl: apiPokemon.sprites.other?.["official-artwork"]?.front_default || apiPokemon.sprites.front_default,
                description: description,
                types: apiPokemon.types
                    .map((t): PokemonType | null => typesMap.get(t.type.name) ?? null)
                    .filter(t => t != null),
                evolutionLines: lines,
                evolutionStage: evolutionStage ?? 0,
                id: apiPokemon.id,
                generation: pokemonGeneration,
                height: apiPokemon.height, // decimeters
                weight: apiPokemon.weight,

                // stats
                attack: apiPokemon.stats.find(stat => stat.stat.name == PokeApiPokemonStat.ATTACK)?.base_stat ?? null,
                defense: apiPokemon.stats.find(stat => stat.stat.name == PokeApiPokemonStat.DEFENSE)?.base_stat ?? null,
                hp: apiPokemon.stats.find(stat => stat.stat.name == PokeApiPokemonStat.HP)?.base_stat ?? null,
                specialAttack: apiPokemon.stats.find(stat => stat.stat.name == PokeApiPokemonStat.SPECIAL_ATTACK)?.base_stat ?? null,
                specialDefense: apiPokemon.stats.find(stat => stat.stat.name == PokeApiPokemonStat.SPECIAL_DEFENSE)?.base_stat ?? null,
                speed: apiPokemon.stats.find(stat => stat.stat.name == PokeApiPokemonStat.SPEED)?.base_stat ?? null,
            }
        });
    }
    async findPokemons(filters: PokemonListFilter): Promise<Page<PokemonRelations<Pokemon, "generation" | "types"> & PokemonSearch>> {
        const pokemons = await this.cache(this.pokemonsCachekey, () => this.getAllPokemons(), 0);
        let filteredPokemons = pokemons;
        
        if (filters.type) {
            filteredPokemons = filteredPokemons.filter(p => p.types.some(type => type.handle == filters.type));
        }

        if (filters.generation) {
            filteredPokemons = filteredPokemons.filter(p => p.generation.handle == filters.generation);
        }
        
        if (filters.name) {
            const pokemonsMatch = filteredPokemons
                .filter(pokemon =>
                    normalizeText(pokemon.name).includes(filters.name!)
                );

            const pokemonIds = new Set(pokemonsMatch.map(p => p.id));
            const linesSet = new Set(pokemonsMatch.flatMap(p => p.evolutionLines));

            filteredPokemons = filteredPokemons
                .filter(pokemon => {
                    return pokemonIds.has(pokemon.id) || pokemon.evolutionLines.some(line => linesSet.has(line));
                })
                .map((pokemon): PokemonRelations<Pokemon, "generation" | "types"> & PokemonSearch => ({
                    ...pokemon,
                    searchMatch: pokemonIds.has(pokemon.id) ? 'contains' : 'evolution',
                }));
        }

        return {
            count: filteredPokemons.length,
            currentPage: Math.floor(filters.offset / filters.limit) + 1,
            data: filteredPokemons.slice(filters.offset, filters.offset + filters.limit),
            isLast: (filteredPokemons.length + filters.offset) >= filters.limit,
        };
    }
    async findPokemon(id: number): Promise<PokemonRelations<Pokemon, "generation" | "types"> | null> {
        const pokemons = await this.cache(this.pokemonsCachekey, () => this.getAllPokemons(), 0);
        return pokemons.find(p => p.id == id) ?? null;
    }

    findGenerations(): Promise<Array<Generation>> {
        return this.getGenerations()
    }

    findPokemonTypes(): Promise<Array<PokemonType>> {
        return this.getPokemonTypes();
    }
}