'use client'

import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import {
  createFavorite,
  deleteFavorite,
  getFavorites,
} from '@/lib/favorites/favorites.service'
import type { RootState } from '@/lib/store/store'
import type {
  FavoriteCharacter,
  FavoriteCharacterPayload,
} from '@/types/favorites'

type FavoritesState = {
  error: string | null
  items: FavoriteCharacter[]
  pendingCharacterIds: number[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const FAVORITES_LIMIT = 4

const initialState: FavoritesState = {
  error: null,
  items: [],
  pendingCharacterIds: [],
  status: 'idle',
}

export const fetchFavorites = createAsyncThunk('favorites/fetch', async () => {
  return getFavorites()
})

export const addFavorite = createAsyncThunk<
  FavoriteCharacter,
  FavoriteCharacterPayload,
  { rejectValue: string, state: RootState }
>('favorites/add', async (favorite, { getState, rejectWithValue }) => {
  const state = getState()

  if (state.favorites.items.some((item) => item.characterId === favorite.characterId)) {
    return rejectWithValue('Character is already in favorites')
  }

  if (state.favorites.items.length >= FAVORITES_LIMIT) {
    return rejectWithValue('Only 4 favorites are allowed')
  }

  return createFavorite(favorite)
})

export const removeFavorite = createAsyncThunk<
  FavoriteCharacter['id'],
  FavoriteCharacter['id'],
  { state: RootState }
>('favorites/remove', async (favoriteId) => {
  await deleteFavorite(favoriteId)
  return favoriteId
})

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unable to load favorites'
      })
      .addCase(addFavorite.pending, (state, action) => {
        state.error = null
        state.pendingCharacterIds.push(action.meta.arg.characterId)
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.pendingCharacterIds = state.pendingCharacterIds.filter(
          (characterId) => characterId !== action.payload.characterId
        )
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message ?? 'Unable to add favorite'
        state.pendingCharacterIds = state.pendingCharacterIds.filter(
          (characterId) => characterId !== action.meta.arg.characterId
        )
      })
      .addCase(removeFavorite.pending, (state, action) => {
        state.error = null
        const favorite = state.items.find((item) => item.id === action.meta.arg)

        if (favorite) {
          state.pendingCharacterIds.push(favorite.characterId)
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const favorite = state.items.find((item) => item.id === action.payload)

        state.items = state.items.filter((item) => item.id !== action.payload)

        if (favorite) {
          state.pendingCharacterIds = state.pendingCharacterIds.filter(
            (characterId) => characterId !== favorite.characterId
          )
        }
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.error.message ?? 'Unable to remove favorite'
        const favorite = state.items.find((item) => item.id === action.meta.arg)

        if (favorite) {
          state.pendingCharacterIds = state.pendingCharacterIds.filter(
            (characterId) => characterId !== favorite.characterId
          )
        }
      })
  },
})

const selectFavoritesState = (state: RootState) => state.favorites

export const selectFavorites = createSelector(
  selectFavoritesState,
  (state) => state.items
)

export const selectFavoriteCharacterIds = createSelector(
  selectFavorites,
  (items) => new Set(items.map((item) => item.characterId))
)

export const selectPendingFavoriteCharacterIds = createSelector(
  selectFavoritesState,
  (state) => state.pendingCharacterIds
)

export const selectFavoritesStatus = createSelector(
  selectFavoritesState,
  (state) => state.status
)

export const favoritesReducer = favoritesSlice.reducer
