export interface PokeApiApiList<T> {
    count: number;
    next: string;
    previous: string;
    results: Array<T>;
}

export interface PokeApiListItem {
    name: string;
    url: string;
}

export interface PokeApiLanguage {
    name: string;
    url: string;
}