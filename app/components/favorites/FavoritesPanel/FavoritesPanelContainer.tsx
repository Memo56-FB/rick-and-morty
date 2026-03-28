'use client'

import { FavoritesPanel } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import { useFavorites } from '@/app/hooks/useFavorites'

type FavoritesPanelContainerProps = {
  className?: string
  desktopVisible?: boolean
}

export const FavoritesPanelContainer = ({
  className,
  desktopVisible = false,
}: FavoritesPanelContainerProps) => {
  const { favorites, removeFavoriteById } = useFavorites()

  return (
    <FavoritesPanel
      favorites={favorites}
      className={className}
      desktopVisible={desktopVisible}
      onRemoveFavorite={removeFavoriteById}
    />
  )
}
