"use client";

import Link from "next/link";
import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/trpc/react";
import { PokemonListItem } from "./pokemon-list-item";
import { Button } from "~/components/ui/button";
import { usePokemonListStore } from "~/lib/store";
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
import { LoaderCircle } from "lucide-react";

export function PokemonList() {
    const { filters, setFilters, setCurrentPage} = usePokemonListStore()
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
            placeholderData: (prev) => prev,
        }
    );

    const totalPages = Math.ceil((pokemonsPage?.count ?? 0) / ITEMS_PER_PAGE);

    const {
        data: generations,
        isLoading: generationsIsLoading,
        isFetching: generationsIsFetching,
        error: generationsError,
    } = api.generation.findAll.useQuery();

    const {
        data: pokemonTypes,
        isLoading: pokemonTypesIsLoading,
        isFetching: pokemonTypesIsFetching,
        error: pokemonTypesError,
    } = api.pokemonType.findAll.useQuery();
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
                                        className="w-full py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                        value={filters.search}
                                        onChange={(e) => setFilters({search: e.target.value})}
                                    />
                                    <span className="absolute left-3 top-0 h-full flex items-center">
                                        <span className="material-symbols-outlined text-gray-400">
                                            search
                                        </span>
                                    </span>
                                    
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Select onValueChange={(value) => setFilters({type: value})} value={filters.type ?? ""} disabled={pokemonTypesIsLoading}>
                                    <SelectTrigger className="w-[180px] cursor-pointer" loading={pokemonTypesIsLoading}>
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

                                <Select onValueChange={(value) => setFilters({generation: value})} value={filters.generation ?? ""} disabled={generationsIsLoading}>
                                    <SelectTrigger className="w-[180px] cursor-pointer" loading={generationsIsLoading}>
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

                <div className="relative">
                    {isFetching && (
                        <div className="absolute left-0 top-0 w-full h-full bg-background/60 z-1 flex items-center justify-center">
                            <LoaderCircle className="w-12 h-12 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pokemonsPage?.data.map((pokemon) => (
                            <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
                                <PokemonListItem key={pokemon.id} pokemon={pokemon}></PokemonListItem>
                            </Link>
                        ))}
                    </div>
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

                        <div className="flex items-center gap-1">
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