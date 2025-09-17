import type { Generation } from "./generation"
import type { PokemonTypeRelation } from "./pokemon-type-relation"

export interface Pokemon {
    id: number
    name: string
    description: string
    imageUrl: string
    generationId: number
    createdAt: Date
    updatedAt: Date
}

type PokemonRelationMap = {
  types: Array<PokemonTypeRelation>
  generation: Generation;
}

export type PokemonRelations<T, K extends keyof PokemonRelationMap> = T & { [P in K]: PokemonRelationMap[P] }