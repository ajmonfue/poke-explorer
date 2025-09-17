import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import { PokemonListItem } from "./_components/pokemon-list-item";

export default async function Home() {
  const pokemons = await api.pokemon.findAll();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 space-y-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Pokémon by name..."
                    className="w-full py-2 pl-10 pr-4 border-0 bg-gray-100 rounded focus:ring-1 focus:ring-primary-500 focus:outline-none"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2 text-gray-400">
                    search
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <select className="py-2 px-3 border-0 bg-gray-100 rounded focus:ring-1 focus:ring-primary-500 focus:outline-none">
                  <option value="">All Types</option>
                  <option value="electric">Electric</option>
                </select>
                <select className="py-2 px-3 border-0 bg-gray-100 rounded focus:ring-1 focus:ring-primary-500 focus:outline-none">
                  <option value="">All Generations</option>
                  <option value="generation_1">Generation I</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pokemons.map((pokemon) => (
            <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
              <PokemonListItem key={pokemon.id} pokemon={pokemon}></PokemonListItem>
            </Link>
          ))}
        </div>
      </main>
      </div>
    </HydrateClient>
  );
}
