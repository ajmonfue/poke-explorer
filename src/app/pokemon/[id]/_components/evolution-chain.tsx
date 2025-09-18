import type { Pokemon } from "~/models/pokemon";
import { api } from "~/trpc/server";
import { Evolution, type PokemonEvolvable } from "./evolution";

function getPokemonEvolutionTree(evolutions: Array<PokemonEvolvable> ) {
    for(let i = 0; i < evolutions.length; i++) {
        const pokemon: PokemonEvolvable = evolutions[i]!;

        for(let j = i + 1; j < evolutions.length; j++) {
            const posibleNextEvolution = evolutions[j]!;
            if (
                posibleNextEvolution.evolutionStage == pokemon.evolutionStage + 1 &&
                pokemon.evolutionLines.every(line => posibleNextEvolution.evolutionLines.includes(line))
            ) {
                pokemon.nextEvolutions.push(posibleNextEvolution);
            }
        }
    }
    
    const rootIds = new Set(evolutions.map(n => n.id))

    for (const parent of evolutions) {
        for (const child of parent.nextEvolutions) {
            rootIds.delete(child.id)
        }
    }

    // pokemons without predecessors
    return evolutions.filter(n => rootIds.has(n.id));
}

export async function EvolutionChain({pokemon: currentPokemon}: {pokemon: Pokemon}) {
    const evolutions: Array<PokemonEvolvable> = (await api.pokemon
    .findEvolutions({
        evolutionLines: currentPokemon.evolutionLines,
    }))
    .map(pokemon => ({...pokemon, nextEvolutions: []}));
    
    const roots = getPokemonEvolutionTree(evolutions);
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