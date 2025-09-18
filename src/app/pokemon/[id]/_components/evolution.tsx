import Link from "next/link"
import { cn } from "~/lib/utils"
import type { Pokemon, PokemonEvolvable } from "~/models/pokemon"


export function Evolution({pokemon, isRoot = false, currentPokemon}: {pokemon: PokemonEvolvable, isRoot?: boolean, currentPokemon: Pokemon}) {
    return (
        <div className="flex">
            {!isRoot && (
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-gray-400">
                            arrow_forward
                        </span>
                    </div>
                </div>
            )}
            
            <Link href={`/pokemon/${pokemon.id}`}>
                <div className={cn('flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors self-start border', pokemon.id == currentPokemon.id ? 'border-black' : 'border-transparent')}>
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <img
                            src={pokemon.imageUrl}
                            alt={pokemon.name}
                            className="w-20 h-20 transform hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500">#{String(pokemon.id).padStart(3, "0")}</div>
                        <div className="font-medium">{pokemon.name}</div>
                    </div>
                </div>
            </Link>

            { pokemon.nextEvolutions.length > 0 && (
                <div className={cn('flex flex-col gap-2',{'border-l border-gray-100 pl-2 ml-3': pokemon.nextEvolutions.length > 1})}>
                    {pokemon.nextEvolutions.map(pokemon => (
                        <Evolution key={pokemon.id} pokemon={pokemon} currentPokemon={currentPokemon}></Evolution>
                    ))}
                </div>
            )}
            
        </div>
    )
}