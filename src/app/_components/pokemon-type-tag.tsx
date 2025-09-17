import type { PokemonType } from "~/models/pokemon-type";

const pokemonTypeClasses: Record<string, string> = {
  'electric': 'bg-green-100 text-green-800'
}


export function PokemonTypeTag({pokemonType}: {pokemonType: PokemonType}) {
    return (
        <span className={'inline-block px-3 py-1 text-xs rounded-full ' + pokemonTypeClasses[pokemonType.handle]}>
            { pokemonType.name }
        </span>
    )
}