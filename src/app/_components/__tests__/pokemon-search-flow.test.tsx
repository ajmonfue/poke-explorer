import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonList } from '../pokemon-list'
import { usePokemonListStore } from '~/lib/store'
import { api } from '~/trpc/react'
import * as store from '~/lib/store'

jest.mock('~/trpc/react', () => ({
  api: {
    pokemon: {
      findAll: {
        useQuery: jest.fn()
      }
    }
  }
}))

jest.mock('~/lib/store', () => ({
  usePokemonListStore: jest.fn(),
  initialFilters: {
    type: null,
    generation: null,
    search: "",
    currentPage: 1,
  }
}))

jest.mock('~/hooks/use-debounce', () => ({
  useDebounce: jest.fn((value) => value)
}))

const mockGenerations = [
  { id: 1, handle: 'generation-i', name: 'Generation I' },
  { id: 2, handle: 'generation-ii', name: 'Generation II' }
]

const mockPokemonTypes = [
  { id: 1, handle: 'fire', name: 'Fire' },
  { id: 2, handle: 'water', name: 'Water' },
  { id: 3, handle: 'grass', name: 'Grass' }
]

const mockPokemonData = [
  {
    id: 1,
    name: 'Bulbasaur',
    nameSearch: 'bulbasaur',
    imageUrl: 'https://example.com/bulbasaur.png',
    types: [{ id: 3, handle: 'grass', name: 'Grass' }],
    generation: { id: 1, handle: 'generation-i', name: 'Generation I' },
    searchMatch: 'contains' as const
  },
  {
    id: 4,
    name: 'Charmander',
    nameSearch: 'charmander',
    imageUrl: 'https://example.com/charmander.png',
    types: [{ id: 1, handle: 'fire', name: 'Fire' }],
    generation: { id: 1, handle: 'generation-i', name: 'Generation I' },
    searchMatch: 'contains' as const
  }
]

const mockStoreMethods = {
  setFilters: jest.fn(),
  resetFilters: jest.fn(),
  setCurrentPage: jest.fn()
}

describe('Pokemon Search Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
      filters: {
        type: null,
        generation: null,
        search: "",
        currentPage: 1,
      },
      ...mockStoreMethods
    })

    ;(api.pokemon.findAll.useQuery as jest.Mock).mockReturnValue({
      data: {
        data: mockPokemonData,
        count: 2,
        currentPage: 1,
        isLast: true
      },
      isLoading: false,
      isFetching: false,
      error: null
    })
  })

  test('should show clear button when search has text', () => {
    jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
      filters: {
        type: null,
        generation: null,
        search: "bulba",
        currentPage: 1,
      },
      ...mockStoreMethods
    })

    render(
      <PokemonList
        generations={mockGenerations}
        pokemonTypes={mockPokemonTypes}
      />
    )

    const clearButtons = screen.getAllByRole('button')
    const clearButton = clearButtons.find((btn) =>
      btn.querySelector('svg.lucide-x')
    )
    expect(clearButton).toBeInTheDocument()
  })

  test('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup()

    jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
      filters: {
        type: null,
        generation: null,
        search: "bulba",
        currentPage: 1,
      },
      ...mockStoreMethods
    })

    render(
      <PokemonList
        generations={mockGenerations}
        pokemonTypes={mockPokemonTypes}
      />
    )

    const clearButtons = screen.getAllByRole('button')
    const clearButton = clearButtons.find((btn) =>
      btn.querySelector('svg.lucide-x')
    )!
    await user.click(clearButton)

    expect(mockStoreMethods.setFilters).toHaveBeenCalledWith({ search: '' })
  })

  test('should display filtered pokemon results', () => {
    jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
      filters: {
        type: null,
        generation: null,
        search: "bulba",
        currentPage: 1,
      },
      ...mockStoreMethods
    })

    ;(api.pokemon.findAll.useQuery as jest.Mock).mockReturnValue({
      data: {
        data: [mockPokemonData[0]], // Only Bulbasaur
        count: 1,
        currentPage: 1,
        isLast: true
      },
      isLoading: false,
      isFetching: false,
      error: null
    })

    render(
      <PokemonList
        generations={mockGenerations}
        pokemonTypes={mockPokemonTypes}
      />
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Bulbasaur');
    expect(screen.queryByText('Charmander')).not.toBeInTheDocument()
  })

  test('should show "Pokemons not found" when no results', () => {
    ;(api.pokemon.findAll.useQuery as jest.Mock).mockReturnValue({
      data: {
        data: [],
        count: 0,
        currentPage: 1,
        isLast: true
      },
      isLoading: false,
      isFetching: false,
      error: null
    })

    render(
      <PokemonList
        generations={mockGenerations}
        pokemonTypes={mockPokemonTypes}
      />
    )

    expect(screen.getByText('Pokemons not found')).toBeInTheDocument()
  })
})