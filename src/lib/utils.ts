import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Pokemon, PokemonEvolvable } from '~/models/pokemon';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPokemonEvolutionTree(pokemons: Array<Pokemon>) {
  const evolutions: Array<PokemonEvolvable> = pokemons.map(pokemon => ({ ...pokemon, nextEvolutions: [] }));
  for (let i = 0; i < evolutions.length; i++) {
    const pokemon: PokemonEvolvable = evolutions[i]!;

    for (let j = i + 1; j < evolutions.length; j++) {
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