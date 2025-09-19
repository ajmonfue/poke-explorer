"use client"

import { create } from "zustand";

interface FilterState {
    type: string | null
    generation: string | null
    search: string
    currentPage: number
}

interface PokemonListStore {
    filters: FilterState
    setFilters: (filters: Partial<FilterState>) => void
    resetFilters: () => void
    setCurrentPage: (page: number) => void
}


export const initialFilters: FilterState = {
    type: null,
    generation: null,
    search: "",
    currentPage: 1,
}


export const usePokemonListStore = create<PokemonListStore>((set) => ({
    filters: initialFilters,
    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters, currentPage: 1 },
        })),
    resetFilters: () => set({ filters: initialFilters }),
    setCurrentPage: (page) =>
        set((state) => ({
            filters: { ...state.filters, currentPage: page },
        })),
}))