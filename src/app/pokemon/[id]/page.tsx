import { LinkTransition } from "~/components/link-transition";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { PokemonTypeTag } from "~/app/_components/pokemon-type-tag";

import { api, HydrateClient } from "~/trpc/server";
import { EvolutionChain } from "./_components/evolution-chain";
import type { PokemonStats } from "~/models/pokemon";
import { PokemonStat } from "./_components/pokemon-stat";
import { ArrowLeft, Ruler, Weight } from "lucide-react";

interface PokemonPageProps {
  params: Promise<{
    id: number
  }>
}

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
    const { id: paramId } = await params;
    const pokemonId = Number(paramId);

    if (isNaN(pokemonId)) {
        return {
            title: "Pokémon Not Found",
            description: "The requested Pokémon could not be found.",
        };
    }

    const pokemon = await api.pokemon.findById({ id: pokemonId });

    if (!pokemon) {
        return {
            title: "Pokémon Not Found",
            description: "The requested Pokémon could not be found.",
        };
    }

    const pokemonNumber = String(pokemon.id).padStart(3, "0");
    const pokemonTypes = pokemon.types?.map(type => type?.name).filter(Boolean).join(", ") || "";
    const description = `Discover ${pokemon.name} (#${pokemonNumber}), a ${pokemonTypes} type Pokémon from ${pokemon.generation.name}. ${pokemon.description}`;

    return {
        title: `${pokemon.name} (#${pokemonNumber}) - Pokémon Explorer`,
        description: description,
        keywords: [
            "pokemon",
            pokemon.name.toLowerCase(),
            pokemonTypes,
            pokemon.generation.name,
            "stats",
            "evolution",
            "pokedex"
        ].filter(Boolean),
        openGraph: {
            title: `${pokemon.name} (#${pokemonNumber}) - Pokémon Explorer`,
            description: description,
            type: "article",
            url: `/pokemon/${pokemon.id}`,
            images: [
                {
                    url: pokemon.imageUrl,
                    width: 512,
                    height: 512,
                    alt: `${pokemon.name} image`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${pokemon.name} (#${pokemonNumber}) - Pokémon Explorer`,
            description: description,
            images: [pokemon.imageUrl],
        },
    };
}

const pokemonStats: Array<keyof PokemonStats> = [
    'attack',
    'defense',
    'hp',
    'specialAttack',
    'specialDefense',
    'speed',
]

export default async function Page({ params }: PokemonPageProps) {
    const {id: paramId} = await params;
    const pokemonId = Number(paramId);
    if (isNaN(pokemonId)) return notFound();

    const pokemon = await api.pokemon.findById({id: pokemonId});
    if (!pokemon) return notFound();

    const total = pokemonStats.reduce((total, stat) => (pokemon[stat] ?? 0) + total, 0)
    return (
        <HydrateClient>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mb-6 flex items-center">
                        <LinkTransition className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors" href="/">
                            <ArrowLeft className="text-gray-600"/>
                            <span>Back to list</span>
                        </LinkTransition>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="flex flex-col sm:flex-row px-6 py-8 items-center">
                                <div className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                                    <img
                                        src={pokemon.imageUrl}
                                        alt={`${pokemon.name} image`}
                                        className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex items-center">
                                        <span className="text-gray-500">#{String(pokemon.id).padStart(3, "0")}</span>
                                        <span className="w-[1px] round bg-gray-100 mx-3 h-4 inline-block"></span>
                                        <span className="text-gray-500">{pokemon.generation.name}</span>
                                    </div>
                                    <h1 className="text-3xl font-bold">
                                        {pokemon.name}
                                    </h1>
                                    <div className="flex gap-2 mt-2">
                                        { (pokemon.types ?? []).map((pokemonType) => pokemonType &&
                                            (
                                                <PokemonTypeTag key={pokemonType.id} pokemonType={pokemonType}></PokemonTypeTag>
                                            ))
                                        }
                                    </div>

                                    <div className="flex items-center mt-6 gap-8">
                                        <div className="">
                                            <div className="text-sm text-muted-foreground inline-flex items-center text-gray-500">
                                                <span className="w-[20px]">
                                                    <Weight size={14}/>
                                                </span>
                                                
                                                Weight
                                            </div>
                                            <div className="font-semibold pl-[20px]">
                                                {parseFloat((pokemon.weight / 10).toFixed(2))}kg
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm text-muted-foreground inline-flex items-center text-gray-500">
                                                <span className="w-[20px]">
                                                    <Ruler size={14}/>
                                                </span>
                                                Height
                                            </div>
                                            <div className="font-semibold pl-[20px]">
                                                {parseFloat((pokemon.height / 10).toFixed(2))}m
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
                                { pokemon.evolutionLines.length > 0 && (
                                    <div className="lg:col-span-3">
                                        <EvolutionChain pokemon={pokemon}></EvolutionChain>
                                    </div>
                                )}
                                
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                                        <h2 className="text-xl font-semibold mb-4">Base Stats</h2>
                                        <div className="space-y-4">
                                            {pokemonStats.map(stat => pokemon[stat] && (
                                                <PokemonStat key={stat} pokemonStats={pokemon} stat={stat}></PokemonStat>
                                            ))}

                                            <div className="mt-2 pt-2">
                                                <div className="flex justify-between font-bold">
                                                    <span>Total</span>
                                                    <span>{total}</span>
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
