import type { PokeApiLanguage, PokeApiListItem } from "./api";
import type { PokeApiGenerationListItem } from "./generation";
import type { PokeApiSpecieSimple } from "./specie";

export interface PokeApiPokemonListItem extends PokeApiListItem {
}

export interface PokeApiPokemon {
    id: number;
    name: string;
    stats: Array<any>;
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

