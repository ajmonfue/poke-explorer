import type { Pokemon, PokemonEvolvable } from "~/models/pokemon";
import { api } from "~/trpc/server";
import { Evolution } from "./evolution";
import { getPokemonEvolutionTree } from "~/lib/utils";


export async function EvolutionChain({pokemon: currentPokemon}: {pokemon: Pokemon}) {
    const roots: Array<PokemonEvolvable> = getPokemonEvolutionTree(await api.pokemon
        .findPokemonEvolutions({
            id: currentPokemon.id,
        }));
    
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden pt-6 pb-2 px-2">
            <h2 className="text-xl font-semibold px-4">Evolution Chain</h2>
            <div className="text-center">
                <div className="inline-block max-w-full overflow-x-auto p-4">
                    {roots.map(root => (
                        <Evolution key={root.id} pokemon={root} isRoot currentPokemon={currentPokemon}></Evolution>
                    ))}
                </div>
            </div>
        </div>
    )
}