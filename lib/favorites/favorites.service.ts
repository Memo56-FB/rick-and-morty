import { favoritesHttpClient } from '@/lib/favorites/client'
import type {
  FavoriteCharacter,
  FavoriteCharacterPayload,
} from '@/types/favorites'

export const getFavorites = async () => {
  return favoritesHttpClient.get<FavoriteCharacter[]>('favorites')
}

export const createFavorite = async (favorite: FavoriteCharacterPayload) => {
  return favoritesHttpClient.post<FavoriteCharacter, FavoriteCharacterPayload>(
    'favorites',
    favorite
  )
}

export const deleteFavorite = async (favoriteId: FavoriteCharacter['id']) => {
  return favoritesHttpClient.delete<FavoriteCharacter>(`favorites/${favoriteId}`)
}
