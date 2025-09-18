import type { PokemonType } from "~/models/pokemon-type";

const pokemonTypeClasses: Record<string, string> = {
    normal: 'bg-gray-100 text-gray-800',
    fire: 'bg-red-100 text-red-800',
    water: 'bg-blue-100 text-blue-800',
    electric: 'bg-yellow-100 text-yellow-800',
    grass: 'bg-green-100 text-green-800',
    ice: 'bg-sky-100 text-sky-800',
    fighting: 'bg-amber-100 text-amber-800',
    poison: 'bg-pink-100 text-pink-800',
    ground: 'bg-amber-300 text-amber-900',
    flying: 'bg-cyan-100 text-cyan-800',
    psychic: 'bg-stone-100 text-stone-800',
    bug: 'bg-zinc-100 text-zinc-800',
    rock: 'bg-slate-100 text-slate-800',
    ghost: 'bg-rose-100 text-rose-800',
    dragon: 'bg-fuchsia-100 text-fuchsia-800',
    dark: 'bg-indigo-100 text-indigo-800',
    steel: 'bg-cyan-100 text-cyan-800',
    fairy: 'bg-teal-100 text-teal-800',
}


export function PokemonTypeTag({ pokemonType }: { pokemonType: PokemonType }) {
    return (
        <span className={'inline-block px-3 py-1 text-xs rounded-full ' + pokemonTypeClasses[pokemonType.handle]}>
            {pokemonType.name}
        </span>
    )
}