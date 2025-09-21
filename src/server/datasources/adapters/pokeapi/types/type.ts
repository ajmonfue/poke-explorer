import type { PokeApiLanguage, PokeApiListItem } from "./api";

export type PokeApiTypeListItem = PokeApiListItem;
export interface PokeApiType {
    id: number;
    name: string;
    names: Array<{
        name: string;
        language: PokeApiLanguage,
    }>
}