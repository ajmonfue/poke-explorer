import type { Generation } from "./generation"
import type { PokemonType } from "./pokemon-type"


export interface Pokemon {
    id: number
    name: string
    description: string
    imageUrl: string
    //generationId: number
    evolutionLines: Array<string>;
    evolutionStage: number;
    //createdAt: Date
    //updatedAt: Date
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