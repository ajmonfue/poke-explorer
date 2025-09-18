import Link from "next/link";
import { notFound } from "next/navigation";
import { PokemonTypeTag } from "~/app/_components/pokemon-type-tag";

import { api, HydrateClient } from "~/trpc/server";
import { EvolutionChain } from "./_components/evolution-chain";

interface PokemonPageProps {
  params: Promise<{
    id: number
  }>
}

export default async function Page({ params }: PokemonPageProps) {
    const {id: paramId} = await params;
    const pokemonId = Number(paramId);
    if (isNaN(pokemonId)) return notFound();

    const pokemon = await api.pokemon.findById({id: pokemonId});
    if (!pokemon) return notFound();

    return (
        <HydrateClient>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mb-6 flex items-center">
                        <Link className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors" href="/">
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span>Back to list</span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="flex flex-col sm:flex-row px-6 py-8">
                                <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                                    <img
                                        src={pokemon.imageUrl}
                                        alt={`${pokemon.name} image`}
                                        className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-gray-500 text-sm">#{String(pokemon.id).padStart(3, "0")}</div>
                                    <h1 className="text-3xl font-bold">
                                        {pokemon.name}
                                    </h1>
                                    <div className="flex gap-2 mt-2">
                                        { (pokemon.types ?? []).map((pokemonTypeRelation, idx) => pokemonTypeRelation.pokemonType ?
                                            (
                                            <PokemonTypeTag key={idx} pokemonType={pokemonTypeRelation.pokemonType}></PokemonTypeTag>
                                            ) : (<></>))
                                        }
                                    </div>
                                    <div className="text-gray-600 mt-2">
                                        { pokemon.generation?.name }
                                    </div>

                                    <div className="flex items-center mt-6 gap-8">
                                        <div className="">
                                            <div className="text-sm text-muted-foreground inline-flex items-center text-gray-500">
                                                <span className="material-symbols-outlined !text-sm w-[20px]">weight</span>
                                                Weight
                                            </div>
                                            <div className="font-semibold pl-[20px]">
                                                13kg
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm text-muted-foreground inline-flex items-center text-gray-500">
                                                <span className="material-symbols-outlined !text-sm w-[20px]">height</span>
                                                Height
                                            </div>
                                            <div className="font-semibold pl-[20px]">
                                                13m
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="px-6 py-8">
                                    <h2 className="text-xl font-semibold mb-4">About</h2>
                                    <p className="text-gray-700 mb-4">
                                        {pokemon.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-4">
                        <div>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                <div className="lg:col-span-3">
                                    <EvolutionChain pokemon={pokemon}></EvolutionChain>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                                        <h2 className="text-xl font-semibold mb-4">Base Stats</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span>HP</span>
                                                    <span>45</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-2 bg-red-400 rounded-full"
                                                        style={{ width: "45%" }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span>Attack</span>
                                                    <span>45</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-2 bg-orange-400 rounded-full"
                                                        style={{ width: "45%" }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span>Defense</span>
                                                    <span>45</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-2 bg-yellow-400 rounded-full"
                                                        style={{ width: "45%" }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span>Sp. Attack</span>
                                                    <span>45</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-2 bg-blue-400 rounded-full"
                                                        style={{ width: "45%" }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span>Sp. Defense</span>
                                                    <span>45</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-2 bg-green-400 rounded-full"
                                                        style={{ width: "45%" }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span>Speed</span>
                                                    <span>45</span>
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-2 bg-pink-400 rounded-full"
                                                        style={{ width: "45%" }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="mt-2 pt-2">
                                                <div className="flex justify-between font-bold">
                                                    <span>Total</span>
                                                    <span>45</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </HydrateClient>
    );
}
