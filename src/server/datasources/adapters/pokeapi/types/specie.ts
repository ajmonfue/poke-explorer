import type { PokeApiLanguage, PokeApiListItem } from "./api";
import type { PokeApiGenerationListItem } from "./generation";
export type PokeApiSpecieSimple = PokeApiListItem;
export interface PokeApiPokemonSpecie {
    evolution_chain: {
        url: string;
    }
    flavor_text_entries: Array<{
        flavor_text: string;
        language: PokeApiLanguage,
        version: {
            name: string,
            url: string
        }
    }>
    generation: PokeApiGenerationListItem,
    names: Array<{
        name: string;
        language: PokeApiLanguage;
    }>
}