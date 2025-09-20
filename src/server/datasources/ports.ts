import type { PokemonListFilter } from "~/models/filters";
import type { Generation } from "~/models/generation";
import type { Page } from "~/models/pagination";
import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import type { PokemonType } from "~/models/pokemon-type";

export interface IDataSourceAdapter {
    findPokemonEvolutions(id: number): Promise<Array<Pokemon>>;
    findPokemons(filters: PokemonListFilter): Promise<Page<PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch>>;
    findPokemon(id: number): Promise<PokemonRelations<Pokemon, 'generation' | 'types'> | null>;

    findGenerations(): Promise<Array<Generation>>;
    findPokemonTypes(): Promise<Array<PokemonType>>;
}