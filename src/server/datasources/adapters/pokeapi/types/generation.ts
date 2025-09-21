import type { PokeApiLanguage, PokeApiListItem } from "./api";

export type PokeApiGenerationListItem = PokeApiListItem;
export interface PokeApiGeneration {
    id: number;
    name: string;
    names: Array<{
        name: string;
        language: PokeApiLanguage,
    }>
}