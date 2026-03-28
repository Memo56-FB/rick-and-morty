'use client'

import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { fetchFavorites, selectFavoritesStatus } from '@/lib/store/favorites/favorites.slice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { makeStore } from '@/lib/store/store'

type StoreProviderProps = {
  children: React.ReactNode
}

const FavoritesBootstrap = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectFavoritesStatus)

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchFavorites())
    }
  }, [dispatch, status])

  return null
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [store] = useState(() => makeStore())

  return (
    <Provider store={store}>
      <FavoritesBootstrap />
      {children}
    </Provider>
  )
}
