import { api } from "~/trpc/server";
import { PokemonList } from "./pokemon-list";
import { initialFilters } from '~/lib/store';
import { ITEMS_PER_PAGE } from "~/lib/constants";

export async function PokemonListPage() {

    const [pokemonsPage, generations, pokemonTypes] = await Promise.all([
        api.pokemon.findAll({
            name: initialFilters.search || undefined,
            type: initialFilters.type || undefined,
            generation: initialFilters.generation || undefined,
            limit: ITEMS_PER_PAGE,
            offset: 0,
        }),
        api.generation.findAll(),
        api.pokemonType.findAll()
    ]);

    return (
        <PokemonList
            initialPokemonsPage={pokemonsPage}
            generations={generations}
            pokemonTypes={pokemonTypes}></PokemonList>
    )
}