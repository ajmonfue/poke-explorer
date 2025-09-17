import { HydrateClient } from "~/trpc/server";
import { PokemonList } from "./_components/pokemon-list";

export default async function Home() {

  return (
    <HydrateClient>
      <PokemonList></PokemonList>
    </HydrateClient>
  );
}
