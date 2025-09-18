import type { PokeApiLanguage, PokeApiListItem } from "./api";
import type { PokeApiGenerationListItem } from "./generation";
import type { PokeApiSpecieSimple } from "./specie";

export interface PokeApiPokemonListItem extends PokeApiListItem {
}

export enum PokeApiPokemonStat {
  HP = "hp",
  ATTACK = "attack",
  DEFENSE = "defense",
  SPECIAL_ATTACK = "special-attack",
  SPECIAL_DEFENSE = "special-defense",
  SPEED = "speed",
}

export interface PokeApiPokemon {
    id: number;
    name: string;
    stats: Array<{
      base_stat: number
      effort: number
      stat: {
        name: PokeApiPokemonStat
        url: string
      }
    }>;
    types: Array<{
      slot: number,
      type: {
        name: string,
        url: string
      }
    }>;
    weight: number;
    height: number;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string | null
            }
        }
    }
    species: PokeApiSpecieSimple,
}

