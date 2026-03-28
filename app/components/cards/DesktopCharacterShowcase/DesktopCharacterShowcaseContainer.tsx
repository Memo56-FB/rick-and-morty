'use client'

import { useState } from 'react'
import type { FavoriteCharacter } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import { DesktopCharacterShowcase } from '@/app/components/cards/DesktopCharacterShowcase/DesktopCharacterShowcase'
import { useDesktopCharacterSearch } from './hooks/useDesktopCharacterSearch'
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
  const searchCharacters = useDesktopCharacterSearch()
  const paginatedCharacters = useDesktopPaginatedCharacters(initialCharactersPage, {
    disabled: searchCharacters.hasQuery,
  })

  const activeCharacters = searchCharacters.isSearchMode
    ? searchCharacters.visibleCharacters
    : paginatedCharacters.visibleCharacters
  const currentCharacter = activeCharacters.find(
    (character) => character.id === selectedCharacterId
  ) ?? activeCharacters[0] ?? null
  const handleNextGroup = searchCharacters.isSearchMode
    ? searchCharacters.handleNextGroup
    : paginatedCharacters.handleNextGroup
  const handlePreviousGroup = searchCharacters.isSearchMode
    ? searchCharacters.handlePreviousGroup
    : paginatedCharacters.handlePreviousGroup
  const isLoadingPage = searchCharacters.isSearchMode
    ? searchCharacters.isSearching
    : paginatedCharacters.isLoadingPage
  const showPager = searchCharacters.isSearchMode
    ? searchCharacters.showPager
    : paginatedCharacters.showPager

  if (!currentCharacter) {
    return null
  }

  return (
    <DesktopCharacterShowcase
      currentCharacter={currentCharacter}
      characters={activeCharacters}
      favorites={favorites}
      searchQuery={searchCharacters.searchQuery}
      showPager={showPager}
      isLoadingPage={isLoadingPage}
      onSearchChange={searchCharacters.handleSearchChange}
      onSelectCharacter={setSelectedCharacterId}
      onPreviousPage={handlePreviousGroup}
      onNextPage={handleNextGroup}
    />
  )
}
