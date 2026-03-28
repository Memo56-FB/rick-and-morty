'use client'

import { useState } from 'react'
import { DesktopCharacterShowcase } from '@/app/components/cards/DesktopCharacterShowcase/DesktopCharacterShowcase'
import { useFavorites } from '@/app/hooks/useFavorites'
import { useDesktopCharacterSearch } from './hooks/useDesktopCharacterSearch'
import { useDesktopPaginatedCharacters } from './hooks/useDesktopPaginatedCharacters'
import type { CharactersPage } from '@/types/rick-and-morty'

type DesktopCharacterShowcaseContainerProps = {
  initialCharactersPage: CharactersPage
}

export const DesktopCharacterShowcaseContainer = ({
  initialCharactersPage,
}: DesktopCharacterShowcaseContainerProps) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  )
  const {
    favoriteCharacterIds,
    isFavoritePending,
    toggleFavorite,
  } = useFavorites()
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
      favoriteCharacterIds={favoriteCharacterIds}
      searchQuery={searchCharacters.searchQuery}
      showPager={showPager}
      isLoadingPage={isLoadingPage}
      isFavoritePending={isFavoritePending}
      onSearchChange={searchCharacters.handleSearchChange}
      onSelectCharacter={setSelectedCharacterId}
      onToggleFavorite={toggleFavorite}
      onPreviousPage={handlePreviousGroup}
      onNextPage={handleNextGroup}
    />
  )
}
