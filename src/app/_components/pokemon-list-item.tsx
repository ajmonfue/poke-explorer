import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import { PokemonTypeTag } from "./pokemon-type-tag";
import { cn } from "~/lib/utils";
import styles from './pokemon-list-item.module.css';
import { normalizeText } from "~/lib/normalize";
import Image from "next/image";


export function PokemonListItem({pokemon, search}: {pokemon: PokemonRelations<Pokemon, 'types' | 'generation'> & PokemonSearch, search?: string}) {
  let matchFound: {startIndex: number, endIndex: number} | null = null;
  if (search && pokemon.searchMatch == 'contains') {
    const normalizedSearch = normalizeText(search);
    const startIndex = pokemon.nameSearch.indexOf(normalizedSearch);
    matchFound = {
      startIndex,
      endIndex: startIndex + normalizedSearch.length
    }
  }
  
  return <div
      className={cn(
        'bg-white p-4 rounded shadow-sm hover:shadow transition-shadow cursor-pointer relative',
        {
          [styles.matchEvolution!]: pokemon.searchMatch == 'evolution',
          [styles.matchContains!]: pokemon.searchMatch == 'contains',
        }
      )}
    >
      {
        pokemon.searchMatch == 'evolution' && (
          <div className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs text-gray-500 border-primary absolute right-3 top-3">
            Evolution
          </div>
        )
      }
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
          <div className="relative w-16 h-16">
            <Image
              src={pokemon.imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400">#{String(pokemon.id).padStart(3, "0")}</span>
            <span className="w-[1px] round bg-gray-100 mx-3 h-4 inline-block"></span>
            <span className="text-sm text-gray-400">{pokemon.generation.name}</span>
          </div>
          <h2 className="text-lg font-medium">
            { matchFound != null ?
              (<span>{pokemon.name.substring(0,  matchFound.startIndex)}<span className="text-red-700">{pokemon.name.substring(matchFound.startIndex,  matchFound.endIndex)}</span>{pokemon.name.substring(matchFound.endIndex)}</span>)
              : pokemon.name}
          </h2>
          <div className="flex gap-2 mt-1">
            { (pokemon.types ?? []).map((pokemonType) => pokemonType &&
              (
                <PokemonTypeTag key={pokemonType.id} pokemonType={pokemonType}></PokemonTypeTag>
              )) }
          </div>
        </div>
      </div>
    </div>
}
