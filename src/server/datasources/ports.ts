import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";

export interface IDataSourceAdapter {
    findEvolutions(evolutionLines: Array<string>): Promise<Array<Pokemon>>;
    findAllPokemons(filters: {name?: string}): Promise<Array<PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch>>;
    findPokemonById(id: number): Promise<PokemonRelations<Pokemon, 'generation' | 'types'> | null>
}