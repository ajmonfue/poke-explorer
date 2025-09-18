export interface PokemonListFilter {
    type?: string;
    generation?: string;
    name?: string;
    offset: number;
    limit: number;
}