import type { PokeApiLanguage, PokeApiListItem } from "./api";

export interface PokeApiGenerationListItem extends PokeApiListItem {
}
export interface PokeApiGeneration {
    id: number;
    name: string;
    names: Array<{
        name: string;
        language: PokeApiLanguage,
    }>
}