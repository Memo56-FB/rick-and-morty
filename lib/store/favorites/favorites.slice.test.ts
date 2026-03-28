import { configureStore } from '@reduxjs/toolkit'
import { favoritesReducer } from '@/lib/store/favorites/favorites.slice'
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
  selectFavoriteCharacterIds,
} from '@/lib/store/favorites/favorites.slice'
import * as favoritesService from '@/lib/favorites/favorites.service'

const createTestStore = () =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  })

describe('favorites slice', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads favorites from the service', async () => {
    vi.spyOn(favoritesService, 'getFavorites').mockResolvedValue([
      {
        id: '1',
        characterId: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
      },
    ])

    const store = createTestStore()

    await store.dispatch(fetchFavorites())

    expect(store.getState().favorites.items).toHaveLength(1)
    expect(store.getState().favorites.status).toBe('succeeded')
  })

  it('adds a favorite through the async thunk', async () => {
    vi.spyOn(favoritesService, 'createFavorite').mockResolvedValue({
      id: '1',
      characterId: 1,
      name: 'Rick Sanchez',
      image: 'rick.png',
    })

    const store = createTestStore()

    await store.dispatch(
      addFavorite({
        characterId: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
      })
    )

    expect(store.getState().favorites.items).toEqual([
      {
        id: '1',
        characterId: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
      },
    ])
  })

  it('rejects duplicate favorites', async () => {
    vi.spyOn(favoritesService, 'createFavorite').mockResolvedValue({
      id: '1',
      characterId: 1,
      name: 'Rick Sanchez',
      image: 'rick.png',
    })

    const store = createTestStore()

    await store.dispatch(
      addFavorite({
        characterId: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
      })
    )

    const result = await store.dispatch(
      addFavorite({
        characterId: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
      })
    )

    expect(addFavorite.rejected.match(result)).toBe(true)
    expect(store.getState().favorites.error).toBe(
      'Character is already in favorites'
    )
  })

  it('removes a favorite and updates selectors', async () => {
    vi.spyOn(favoritesService, 'createFavorite').mockResolvedValue({
      id: '1',
      characterId: 1,
      name: 'Rick Sanchez',
      image: 'rick.png',
    })
    vi.spyOn(favoritesService, 'deleteFavorite').mockResolvedValue({
      id: '1',
      characterId: 1,
      name: 'Rick Sanchez',
      image: 'rick.png',
    })

    const store = createTestStore()

    await store.dispatch(
      addFavorite({
        characterId: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
      })
    )
    await store.dispatch(removeFavorite('1'))

    const favoriteIds = selectFavoriteCharacterIds(store.getState())

    expect(store.getState().favorites.items).toEqual([])
    expect(favoriteIds.has(1)).toBe(false)
  })
})
