import type { Pokemon, PokemonRelations } from "~/models/pokemon";
import { PokemonTypeTag } from "./pokemon-type-tag";



export function PokemonListItem({pokemon}: {pokemon: PokemonRelations<Pokemon, 'types' | 'generation'>}) {
  return <div
      className="bg-white p-4 rounded shadow-sm hover:shadow transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="w-16 h-16"
          />
        </div>
        <div>
          <div className="text-sm text-gray-500">#{String(pokemon.id).padStart(3, "0")}</div>
          <h2 className="text-lg font-medium">{pokemon.name}</h2>
          <div className="flex gap-2 mt-1">
            { (pokemon.types ?? []).map((pokemonTypeRelation, idx) => pokemonTypeRelation.pokemonType ?
              (
                <PokemonTypeTag key={idx} pokemonType={pokemonTypeRelation.pokemonType}></PokemonTypeTag>
              ) : (<></>)) }
          </div>
          <div className="text-sm text-gray-500 mt-1">
            { pokemon.generation.name }
          </div>
        </div>
      </div>
    </div>
}
