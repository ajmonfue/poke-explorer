import { type Metadata } from "next";
import { HydrateClient } from "~/trpc/server";
import { PokemonListPage } from "./_components/pokemon-list-page";

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

  return (
    <HydrateClient>
      <PokemonListPage></PokemonListPage>
    </HydrateClient>
  );
}
