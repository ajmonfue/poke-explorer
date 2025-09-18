import type { Pokemon, PokemonEvolvable } from "~/models/pokemon";
import { api } from "~/trpc/server";
import { Evolution } from "./evolution";
import { getPokemonEvolutionTree } from "~/lib/utils";


export async function EvolutionChain({pokemon: currentPokemon}: {pokemon: Pokemon}) {
    const roots: Array<PokemonEvolvable> = getPokemonEvolutionTree(await api.pokemon
    .findEvolutions({
        evolutionLines: currentPokemon.evolutionLines,
    }));
    
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Evolution Chain</h2>
            <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2 md:gap-4">
                {roots.map(root => (
                    <Evolution key={root.id} pokemon={root} isRoot currentPokemon={currentPokemon}></Evolution>
                ))}
            </div>
        </div>
    )
}