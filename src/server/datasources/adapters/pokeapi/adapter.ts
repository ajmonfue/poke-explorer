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
import { DataSourceCache } from "./cache";

export class PokeApiDataSource implements IDataSourceAdapter {
    private readonly baseUrl = 'https://pokeapi.co/api/v2';
    private readonly language = 'en';
    private readonly fallbackPokemonImage = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    private readonly pokemonsCachekey = 'pokemons';
    private readonly cache = new DataSourceCache();

    private async fetchWithCache<T>(url: string, cacheDuration: number = DataSourceCache.CACHE_DURATION): Promise<T> {
        return await this.cache.get(url, async () => await this.fetch<T>(url), cacheDuration);
    }

    private async fetch<T>(url: string) {
        let response;
        try { 
            response = await fetch(url);
        }
        catch(err) {
            console.error(`error fetching ${url}`, err);
            throw err;
        }
        
        if (response.status != 200) {
            throw new Error(`error fetching ${url} with response status ${response.status}`);
        }
        return await response.json() as T;
    }

    async findPokemonEvolutions(id: number): Promise<Array<Pokemon>> {
        if (this.cache.contains(this.pokemonsCachekey)) {
            const pokemons = await this.getAllPokemons();
            const pokemon = pokemons.find(p => p.id == id);
            if (pokemon == null) {
                throw new Error(`pokemon not found with id ${id}`);
            }
            const filteredPokemons = pokemons
                .filter(p => p.evolutionLines.some(line => pokemon.evolutionLines.includes(line)));
            filteredPokemons.sort((a, b) => a.evolutionStage - b.evolutionStage);
            return filteredPokemons;
        }

        const apiPokemon = await this.fetchWithCache<PokeApiPokemon>(this.getApiPokemonUrl(id));
        const specie = await this.fetchWithCache<PokeApiPokemonSpecie>(apiPokemon.species.url);
        const evolutionChain = await this.fetchWithCache<PokeApiEvolutionChain>(specie.evolution_chain.url);
    
        // get pokemos in chain
        const pokemonNames = new Set<string>();
        (function addPokemonNames(chainEvolution: PokeApiEvolution) {
            pokemonNames.add(chainEvolution.species.name);
            chainEvolution.evolves_to.forEach(addPokemonNames);
        })(evolutionChain.chain);

        return await Promise.all(Array.from(pokemonNames).map(pokemonName => this.getApiPokemon(this.getApiPokemonUrl(pokemonName))));
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
        for (const evolvesTo of node.evolution.evolves_to) {
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

    private getApiPokemonUrl(pokemonId: number | string) {
        return `${this.baseUrl}/pokemon/${pokemonId}`;
    }

    private async getApiPokemon(pokemonUrl: string, typesMap?: Map<string, PokemonType>, generationsMap?: Map<string, Generation>):
        Promise<PokemonRelations<Pokemon, "generation" | "types">> {
        typesMap ??= (await this.getPokemonTypes()).reduce((map, item) => map.set(item.handle, item), new Map<string, PokemonType>());
        generationsMap ??= (await this.getGenerations()).reduce((map, item) => map.set(item.handle, item), new Map<string, Generation>());

        const apiPokemon = await this.fetchWithCache<PokeApiPokemon>(pokemonUrl);
        const specie = await this.fetchWithCache<PokeApiPokemonSpecie>(apiPokemon.species.url);
        const evolutionChain = await this.fetchWithCache<PokeApiEvolutionChain>(specie.evolution_chain.url);

        const description = specie.flavor_text_entries
            .find(entry => entry.language.name == this.language)?.flavor_text
            .replace(/[\n\f\r\t]/g, '') ?? '';
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
        const pokemonName = specie.names.find(n => n.language.name == this.language)?.name ?? apiPokemon.name;
        return {
            name: pokemonName,
            nameSearch: normalizeText(pokemonName),
            imageUrl: apiPokemon.sprites.other?.["official-artwork"]?.front_default ?? apiPokemon.sprites.front_default ?? this.fallbackPokemonImage,
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
    }

    public async getAllPokemons() {
        return await this.cache.get(
            this.pokemonsCachekey,
            () => this.getPagePokemons({
                    limit:10000,
                    offset: 0
                })
                .then(r => r.data),
            0,
        );
    }

    public async getPagePokemons({limit, offset}: {limit: number, offset: number}): Promise<{count: number, data: Array<PokemonRelations<Pokemon, "generation" | "types">>}> {
        const typesMap = (await this.getPokemonTypes()).reduce((map, item) => map.set(item.handle, item), new Map<string, PokemonType>());
        const generationsMap = (await this.getGenerations()).reduce((map, item) => map.set(item.handle, item), new Map<string, Generation>());

        const pokemonListResponse = await this.fetchWithCache<PokeApiApiList<PokeApiPokemonListItem>>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
        
        return {
            count: pokemonListResponse.count,
            data: await Promise.all(
                pokemonListResponse.results.map((pokemonListItem) => this.getApiPokemon(pokemonListItem.url, typesMap, generationsMap))
            )
        };
    }

    public async findPokemons(filters: PokemonListFilter): Promise<Page<PokemonRelations<Pokemon, "generation" | "types"> & PokemonSearch>> {
        const filterName = filters.name?.trim();
        const shouldFilter = filterName ?? filters.type ?? filters.generation;

        if (!shouldFilter) {
            const pagePokemons = await this.getPagePokemons(filters);
            return {
                count: pagePokemons.count,
                currentPage: Math.floor(filters.offset / filters.limit) + 1,
                data: pagePokemons.data,
                isLast: (pagePokemons.data.length + filters.offset) >= pagePokemons.count,
            };
        }

        let filteredPokemons = await this.getAllPokemons();
        if (filters.type) {
            filteredPokemons = filteredPokemons.filter(p => p.types.some(type => type.handle == filters.type));
        }
        if (filters.generation) {
            filteredPokemons = filteredPokemons.filter(p => p.generation.handle == filters.generation);
        }
        if (filterName) {
            const pokemonsMatch = filteredPokemons
                .filter(pokemon =>
                    pokemon.nameSearch.includes(normalizeText(filterName))
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

        const pageData = filteredPokemons.slice(filters.offset, filters.offset + filters.limit);
        return {
            count: filteredPokemons.length,
            currentPage: Math.floor(filters.offset / filters.limit) + 1,
            data: pageData,
            isLast: (pageData.length + filters.offset) >= filteredPokemons.length,
        };
    }
    
    public  async findPokemon(id: number): Promise<PokemonRelations<Pokemon, "generation" | "types"> | null> {
        if (this.cache.contains(this.pokemonsCachekey)) {
            const pokemons = await this.getAllPokemons();
            return pokemons.find(p => p.id == id) ?? null;
        }
        else {
            return await this.getApiPokemon(this.getApiPokemonUrl(id));
        }
    }

    public  findGenerations(): Promise<Array<Generation>> {
        return this.getGenerations()
    }

    public  findPokemonTypes(): Promise<Array<PokemonType>> {
        return this.getPokemonTypes();
    }
}