import { HydrateClient } from "~/trpc/server";
import { PokemonListPage } from "./_components/pokemon-list-page";

export default async function Home() {

  return (
    <HydrateClient>
      <PokemonListPage></PokemonListPage>
    </HydrateClient>
  );
}
