import { type Metadata } from "next";
import { api, HydrateClient } from "~/trpc/server";
import { PokemonList } from "./_components/pokemon-list";
import { initialFilters } from '~/lib/store';
import { ITEMS_PER_PAGE } from "~/lib/constants";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Pokémon Explorer - Discover All Pokémon",
  description: "Explore and discover all Pokémon with detailed information, stats, types, and evolution chains.",
  keywords: ["pokemon", "pokedex", "evolution", "stats"],
  openGraph: {
    title: "Pokémon Explorer - Discover All Pokémon",
    description: "Explore and discover all Pokémon with detailed information, stats, types, and evolution chains.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pokémon Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokémon Explorer - Discover All Pokémon",
    description: "Explore and discover all Pokémon with detailed information, stats, types, and evolution chains.",
    images: ["/og-image.png"],
  },
};

export default async function Home() {
  const [pokemonsPage, generations, pokemonTypes] = await Promise.all([
      api.pokemon.findAll({
          name: initialFilters.search || undefined,
          type: initialFilters.type || undefined,
          generation: initialFilters.generation || undefined,
          limit: ITEMS_PER_PAGE,
          offset: 0,
      }),
      api.generation.findAll(),
      api.pokemonType.findAll()
  ]);

  return (
    <HydrateClient>
      <PokemonList
        initialPokemonsPage={pokemonsPage}
        generations={generations}
        pokemonTypes={pokemonTypes}
      />
    </HydrateClient>
  );
}
