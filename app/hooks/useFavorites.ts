'use client'

import { useMemo } from 'react'
import {
  addFavorite,
  removeFavorite,
  selectFavoriteCharacterIds,
  selectFavorites,
  selectPendingFavoriteCharacterIds,
} from '@/lib/store/favorites/favorites.slice'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import type { FavoriteCharacter } from '@/types/favorites'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'

type ToggleFavoriteCharacter = Pick<
  RickAndMortyCharacter,
  'id' | 'name' | 'image'
>

export const useFavorites = () => {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector(selectFavorites)
  const favoriteCharacterIds = useAppSelector(selectFavoriteCharacterIds)
  const pendingFavoriteCharacterIds = useAppSelector(
    selectPendingFavoriteCharacterIds
  )

  const favoritesByCharacterId = useMemo(() => {
    return new Map(favorites.map((favorite) => [favorite.characterId, favorite]))
  }, [favorites])

  const toggleFavorite = (character: ToggleFavoriteCharacter) => {
    const favorite = favoritesByCharacterId.get(character.id)

    if (favorite) {
      void dispatch(removeFavorite(favorite.id))
      return
    }

    void dispatch(
      addFavorite({
        characterId: character.id,
        name: character.name,
        image: character.image,
      })
    )
  }

  const removeFavoriteById = (favoriteId: FavoriteCharacter['id']) => {
    void dispatch(removeFavorite(favoriteId))
  }

  const isFavoritePending = (characterId: number) => {
    return pendingFavoriteCharacterIds.includes(characterId)
  }

  return {
    favoriteCharacterIds,
    favorites,
    isFavoritePending,
    removeFavoriteById,
    toggleFavorite,
  }
}
