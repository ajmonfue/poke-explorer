import type { Generation } from "./generation"
import type { PokemonType } from "./pokemon-type"

export interface PokemonStats {
    hp: number | null;
    attack: number | null;
    defense: number | null;
    specialAttack: number | null;
    specialDefense: number | null;
    speed: number | null;
}

export interface Pokemon extends PokemonStats {
    id: number
    name: string
    nameSearch: string
    description: string
    imageUrl: string
    evolutionLines: Array<string>;
    evolutionStage: number;

    weight: number;
    height: number;
}

type PokemonRelationMap = {
    types: Array<PokemonType>
    generation: Generation;
}

export type PokemonRelations<T, K extends keyof PokemonRelationMap> = T & { [P in K]: PokemonRelationMap[P] }

export interface PokemonSearch {
    searchMatch?: 'contains' | 'evolution'
}

export interface PokemonEvolvable extends Pokemon {
    nextEvolutions: Array<PokemonEvolvable>
}