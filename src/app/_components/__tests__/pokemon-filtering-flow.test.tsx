import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PokemonList } from '../pokemon-list'
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
  useDebounce: jest.fn((value: unknown) => value)
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
    generation: { id: 1, handle: 'generation-i', name: 'Generation I' }
  },
  {
    id: 4,
    name: 'Charmander',
    nameSearch: 'charmander',
    imageUrl: 'https://example.com/charmander.png',
    types: [{ id: 1, handle: 'fire', name: 'Fire' }],
    generation: { id: 1, handle: 'generation-i', name: 'Generation I' }
  },
  {
    id: 152,
    name: 'Chikorita',
    nameSearch: 'chikorita',
    imageUrl: 'https://example.com/chikorita.png',
    types: [{ id: 3, handle: 'grass', name: 'Grass' }],
    generation: { id: 2, handle: 'generation-ii', name: 'Generation II' }
  }
]

const mockStoreMethods = {
  setFilters: jest.fn(),
  resetFilters: jest.fn(),
  setCurrentPage: jest.fn()
}

describe('Pokemon Filtering Flow', () => {
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
        count: 3,
        currentPage: 1,
        isLast: true
      },
      isLoading: false,
      isFetching: false,
      error: null
    })
  })

  describe('Type Filtering', () => {
    test('should render type selector with all types', () => {
      render(
        <PokemonList
          generations={mockGenerations}
          pokemonTypes={mockPokemonTypes}
        />
      )

      const typeSelector = screen.getByText('Select a type')
      expect(typeSelector).toBeInTheDocument()
    })

    test('should open type dropdown and show type options', async () => {
      const user = userEvent.setup()

      render(
        <PokemonList
          generations={mockGenerations}
          pokemonTypes={mockPokemonTypes}
        />
      )

      const typeSelector = screen.getByText('Select a type').closest('button[role="combobox"]')!
      await user.click(typeSelector)

      expect(screen.getByRole('option', {name: 'Fire'})).toBeInTheDocument()
      expect(screen.getByRole('option', {name: 'Water'})).toBeInTheDocument()
      expect(screen.getByRole('option', {name: 'Grass'})).toBeInTheDocument()
    })

    test('should filter by fire type when selected', async () => {
      const user = userEvent.setup()

      render(
        <PokemonList
          generations={mockGenerations}
          pokemonTypes={mockPokemonTypes}
        />
      )

      const typeSelector = screen.getByText('Select a type').closest('button[role="combobox"]')!
      await user.click(typeSelector)

      const fireOption = screen.getByRole('option', {name: 'Fire'});
      await user.click(fireOption)

      expect(mockStoreMethods.setFilters).toHaveBeenCalledWith({ type: 'fire' })
    })

    test('should show filtered results when type is selected', () => {
      jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
        filters: {
          type: 'fire',
          generation: null,
          search: "",
          currentPage: 1,
        },
        ...mockStoreMethods
      })

      ;(api.pokemon.findAll.useQuery as jest.Mock).mockReturnValue({
        data: {
          data: [mockPokemonData[1]], // Only Charmander (fire type)
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

      expect(screen.getByText('Charmander')).toBeInTheDocument()
      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
      expect(screen.queryByText('Chikorita')).not.toBeInTheDocument()
    })
  })

  describe('Generation Filtering', () => {
    test('should render generation selector with all generations', () => {
      render(
        <PokemonList
          generations={mockGenerations}
          pokemonTypes={mockPokemonTypes}
        />
      )

      const generationSelector = screen.getByText('Select a generation')
      expect(generationSelector).toBeInTheDocument()
    })

    test('should open generation dropdown and show generation options', async () => {
      const user = userEvent.setup()

      render(
        <PokemonList
          generations={mockGenerations}
          pokemonTypes={mockPokemonTypes}
        />
      )

      const generationSelector = screen.getByText('Select a generation').closest('button[role="combobox"]')!;
      await user.click(generationSelector)

      
      expect(screen.getByRole('option', {name: 'Generation I'})).toBeInTheDocument()
      expect(screen.getByRole('option', {name: 'Generation II'})).toBeInTheDocument()
    })

    test('should filter by Generation II when selected', async () => {
      const user = userEvent.setup()

      render(
        <PokemonList
          generations={mockGenerations}
          pokemonTypes={mockPokemonTypes}
        />
      )

      const generationSelector = screen.getByText('Select a generation').closest('button')!;
      await user.click(generationSelector)

      const genIIOption = screen.getByRole('option', {name: 'Generation II'});
      await user.click(genIIOption)

      expect(mockStoreMethods.setFilters).toHaveBeenCalledWith({ generation: 'generation-ii' })
    })

    test('should show filtered results when generation is selected', () => {
      jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
        filters: {
          type: null,
          generation: 'generation-ii',
          search: "",
          currentPage: 1,
        },
        ...mockStoreMethods
      })

      ;(api.pokemon.findAll.useQuery as jest.Mock).mockReturnValue({
        data: {
          data: [mockPokemonData[2]], // Only Chikorita (Gen II)
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

      expect(screen.getByText('Chikorita')).toBeInTheDocument()
      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
      expect(screen.queryByText('Charmander')).not.toBeInTheDocument()
    })
  })

  describe('Combined Filtering', () => {
    test('should filter by both type and generation', () => {
      jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
        filters: {
          type: 'grass',
          generation: 'generation-i',
          search: "",
          currentPage: 1,
        },
        ...mockStoreMethods
      })

      ;(api.pokemon.findAll.useQuery as jest.Mock).mockReturnValue({
        data: {
          data: [mockPokemonData[0]], // Only Bulbasaur (grass + Gen I)
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
      expect(screen.queryByText('Chikorita')).not.toBeInTheDocument() // Grass but Gen II
      expect(screen.queryByText('Charmander')).not.toBeInTheDocument() // Gen I but Fire
    })

    test('should handle search with type and generation filters', () => {
      jest.spyOn(store, 'usePokemonListStore').mockReturnValue({
        filters: {
          type: 'grass',
          generation: 'generation-i',
          search: "bulba",
          currentPage: 1,
        },
        ...mockStoreMethods
      })

      ;(api.pokemon.findAll.useQuery as jest.Mock).mockReturnValue({
        data: {
          data: [{ ...mockPokemonData[0], searchMatch: 'contains' as const }],
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
    })
  })
})