"use client";

import { LinkTransition } from "~/components/link-transition";
import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/trpc/react";
import { PokemonListItem } from "./pokemon-list-item";
import { Button } from "~/components/ui/button";
import { initialFilters, usePokemonListStore } from "~/lib/store";
import { ITEMS_PER_PAGE } from "~/lib/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import { LoaderCircle, SearchIcon, X } from "lucide-react";
import type { Page } from "~/models/pagination";
import type { Generation } from "~/models/generation";
import type { Pokemon, PokemonRelations, PokemonSearch } from "~/models/pokemon";
import type { PokemonType } from "~/models/pokemon-type";

export function PokemonList({ initialPokemonsPage, generations, pokemonTypes }: {
    initialPokemonsPage?: Page<PokemonRelations<Pokemon, 'generation' | 'types'> & PokemonSearch>,
    generations: Array<Generation>,
    pokemonTypes: Array<PokemonType>
}) {
    const { filters, setFilters, setCurrentPage} = usePokemonListStore();
    const debouncedSearch = useDebounce(filters.search, 300);

    const {
        data: pokemonsPage,
        isLoading,
        isFetching,
        error,
    } = api.pokemon.findAll.useQuery(
        {
            name: debouncedSearch || undefined,
            limit: ITEMS_PER_PAGE,
            offset: (filters.currentPage - 1) * ITEMS_PER_PAGE,
            type: filters.type || undefined,
            generation: filters.generation || undefined,
        },
        {
            initialData: initialFilters == filters ? initialPokemonsPage : undefined,
            placeholderData: (prev) => prev,
        }
    );

    const totalPages = Math.ceil((pokemonsPage?.count ?? 0) / ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6 space-y-4">
                    <div className="bg-white p-4 rounded shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-grow">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search Pokémon by name..."
                                        className="w-full py-2 pl-9 pr-8 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                        value={filters.search}
                                        onChange={(e) => setFilters({search: e.target.value})}
                                    />
                                    <span className="absolute left-3 top-0 h-full flex items-center">
                                        <SearchIcon size={18} className="text-gray-400"></SearchIcon>
                                    </span>
                                    { filters.search && (
                                        <div className="absolute right-3 top-0 h-full flex items-center">
                                            <Button variant="ghost" size="icon" className="size-7" onClick={() => setFilters({search: ''})}>
                                                <X size={18} className="text-gray-400"></X>
                                            </Button>
                                        </div>
                                    )}
                                    
                                </div>
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <Select onValueChange={(value) => setFilters({type: value})} value={filters.type ?? ""}>
                                    <SelectTrigger className="min-w-[180px] cursor-pointer flex-1">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Types</SelectLabel>
                                            { pokemonTypes?.map(type => (
                                                <SelectItem key={type.id} value={type.handle}>{type.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <Button
                                            className="w-full px-2"
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setFilters({type: null})
                                            }}>
                                            Clear
                                        </Button>
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={(value) => setFilters({generation: value})} value={filters.generation ?? ""}>
                                    <SelectTrigger className="min-w-[180px] cursor-pointer flex-1">
                                        <SelectValue placeholder="Select a generation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Generations</SelectLabel>
                                            { generations?.map(generation => (
                                                <SelectItem key={generation.id} value={generation.handle}>{generation.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <Button
                                            className="w-full px-2"
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setFilters({generation: null})
                                            }}>
                                            Clear
                                        </Button>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-20">
                    {
                        isFetching &&
                        <div className="absolute left-0 top-0 w-full h-full bg-background/60 z-1 flex items-center justify-center">
                            <LoaderCircle className="w-12 h-12 animate-spin text-muted-foreground" />
                        </div>
                    }
                    {
                        (pokemonsPage?.data || []).length > 0  &&
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pokemonsPage?.data.map((pokemon) => (
                                <LinkTransition key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
                                    <PokemonListItem pokemon={pokemon} search={filters.search}></PokemonListItem>
                                </LinkTransition>
                            ))}
                        </div> 
                    }
                    {
                        !isFetching && ((pokemonsPage?.data || [])).length == 0 &&
                        <div className="text-center">
                            Pokemons not found
                        </div>
                    }
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(Math.max(1, filters.currentPage - 1))}
                            disabled={filters.currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="block md:hidden">
                            <Select onValueChange={(value) => setCurrentPage(Number(value))} value={String(filters.currentPage)}>
                                <SelectTrigger className="w-[100px] cursor-pointer">
                                    <SelectValue placeholder="Select a page" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            Array.from({ length: totalPages }, (_, i) => (
                                                <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            {totalPages > 5 && filters.currentPage > 3 && (
                                <>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)}>
                                        1
                                    </Button>
                                    <span className="px-2">...</span>
                                </>
                            )}

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = filters.currentPage <= 3 ? i + 1 : filters.currentPage - 2 + i
                                if (pageNum > totalPages) return null

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={filters.currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            })}

                            {totalPages > 5 && filters.currentPage < totalPages - 2 && (
                                <>
                                    <span className="px-2">...</span>
                                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)}>
                                        {totalPages}
                                    </Button>
                                </>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(Math.min(totalPages, filters.currentPage + 1))}
                            disabled={filters.currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}