import type { PokemonListFilter } from "~/models/filters";
import type { Page } from "~/models/pagination";
import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";

export interface IDataSourceAdapter {
    findEvolutions(evolutionLines: Array<string>): Promise<Array<Pokemon>>;
    findAllPokemons(filters: PokemonListFilter): Promise<Page<PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch>>;
    findPokemonById(id: number): Promise<PokemonRelations<Pokemon, 'generation' | 'types'> | null>
}