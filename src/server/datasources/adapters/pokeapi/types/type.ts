import type { PokeApiLanguage, PokeApiListItem } from "./api";

export interface PokeApiTypeListItem extends PokeApiListItem {
}
export interface PokeApiType {
    id: number;
    name: string;
    names: Array<{
        name: string;
        language: PokeApiLanguage,
    }>
}