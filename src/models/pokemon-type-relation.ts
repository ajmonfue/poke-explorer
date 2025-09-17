import type { Pokemon } from "./pokemon";
import type { PokemonType } from "./pokemon-type";

export interface PokemonTypeRelation {
    pokemonId: number;
    pokemonTypeId: number
    pokemon?: Pokemon;
    pokemonType?: PokemonType;
}