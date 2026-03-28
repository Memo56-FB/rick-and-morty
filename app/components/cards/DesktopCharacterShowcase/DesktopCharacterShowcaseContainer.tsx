'use client'

import { useState } from 'react'
import type { FavoriteCharacter } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import { DesktopCharacterShowcase } from '@/app/components/cards/DesktopCharacterShowcase/DesktopCharacterShowcase'
import { useDesktopPaginatedCharacters } from './hooks/useDesktopPaginatedCharacters'
import type { CharactersPage } from '@/types/rick-and-morty'

type DesktopCharacterShowcaseContainerProps = {
  favorites: FavoriteCharacter[]
  initialCharactersPage: CharactersPage
}

export const DesktopCharacterShowcaseContainer = ({
  favorites,
  initialCharactersPage,
}: DesktopCharacterShowcaseContainerProps) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  )
  const {
    handleNextGroup,
    handlePreviousGroup,
    isLoadingPage,
    showPager,
    visibleCharacters,
  } = useDesktopPaginatedCharacters(initialCharactersPage)
  const currentCharacter = visibleCharacters.find(
    (character) => character.id === selectedCharacterId
  ) ?? visibleCharacters[0] ?? null

  if (!currentCharacter) {
    return null
  }

  return (
    <DesktopCharacterShowcase
      currentCharacter={currentCharacter}
      characters={visibleCharacters}
      favorites={favorites}
      showPager={showPager}
      isLoadingPage={isLoadingPage}
      onSelectCharacter={setSelectedCharacterId}
      onPreviousPage={handlePreviousGroup}
      onNextPage={handleNextGroup}
    />
  )
}
