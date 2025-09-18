"use client";

import Link from "next/link";
import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/trpc/react";
import { PokemonListItem } from "./pokemon-list-item";
import { Button } from "~/components/ui/button";
import { usePokemonListStore } from "~/lib/store";
import { ITEMS_PER_PAGE } from "~/lib/constants";

export function PokemonList() {
    const { filters, setFilters, resetFilters, setCurrentPage } = usePokemonListStore()
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
        },
        {
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
                                    <input
                                        type="text"
                                        placeholder="Search Pokémon by name..."
                                        className="w-full py-2 pl-10 pr-4 border-0 bg-gray-100 rounded focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                        value={filters.search}
                                        onChange={(e) => setFilters({search: e.target.value})}
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
                    {pokemonsPage?.data.map((pokemon) => (
                        <Link key={pokemon.id} href={`/pokemon/${pokemon.id}`}>
                            <PokemonListItem key={pokemon.id} pokemon={pokemon}></PokemonListItem>
                        </Link>
                    ))}
                </div>
                {isFetching && (
                    <div className="text-gray-400 mt-2 text-center">Loading…</div>
                )}

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