'use client'

import { configureStore } from '@reduxjs/toolkit'
import { favoritesReducer } from '@/lib/store/favorites/favorites.slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
