'use client'

import { MobileCharacterCarousel } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import { MobileCharacterCardsPreview } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCardsPreview'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'
import { useFavorites } from '@/app/hooks/useFavorites'
import { useMobileCharacterSearch } from './hooks/useMobileCharacterSearch'
import { usePaginatedCharacters } from './hooks/usePaginatedCharacters'
import type { CharactersPage } from '@/types/rick-and-morty'

type MobileCharacterCarouselContainerProps = {
  initialCharactersPage: CharactersPage
}

export const MobileCharacterCarouselContainer = ({
  initialCharactersPage,
}: MobileCharacterCarouselContainerProps) => {
  const {
    favoriteCharacterIds,
    isFavoritePending,
    toggleFavorite,
  } = useFavorites()
  const searchCharacters = useMobileCharacterSearch()
  const paginatedCharacters = usePaginatedCharacters(initialCharactersPage, {
    disabled: searchCharacters.isSearchMode,
  })

  const activeCharacters = searchCharacters.isSearchMode
    ? searchCharacters.characters
    : paginatedCharacters.characters
  const activeIndex = searchCharacters.isSearchMode
    ? searchCharacters.currentIndex
    : paginatedCharacters.currentIndex
  const currentCharacter = searchCharacters.isSearchMode
    ? searchCharacters.currentCharacter
    : paginatedCharacters.currentCharacter
  const nextCharacter = searchCharacters.isSearchMode
    ? searchCharacters.nextCharacter
    : paginatedCharacters.nextCharacter
  const showNavigation = searchCharacters.isSearchMode
    ? searchCharacters.showNavigation
    : paginatedCharacters.showNavigation
  const handleNext = searchCharacters.isSearchMode
    ? searchCharacters.handleNext
    : paginatedCharacters.handleNext
  const handlePrevious = searchCharacters.isSearchMode
    ? searchCharacters.handlePrevious
    : paginatedCharacters.handlePrevious
  const isLoading = searchCharacters.isSearchMode
    ? searchCharacters.isSearching
    : paginatedCharacters.isLoadingPage

  return (
    <>
      <div className='mt-6'>
        <CharacterSearch
          value={searchCharacters.searchQuery}
          onChange={searchCharacters.handleSearchChange}
        />
      </div>

      {currentCharacter ? (
        <>
          <MobileCharacterCardsPreview
            currentCharacter={currentCharacter}
            nextCharacter={nextCharacter}
            favoriteCharacterIds={favoriteCharacterIds}
            isFavoritePending={isFavoritePending}
            onToggleFavorite={toggleFavorite}
          />

          <div className='mt-8 w-full grid place-items-center'>
            <MobileCharacterCarousel
              characters={activeCharacters}
              currentIndex={activeIndex}
              isPageLoading={isLoading}
              showNavigation={showNavigation}
              onRequestNext={handleNext}
              onRequestPrevious={handlePrevious}
            />
          </div>
        </>
      ) : null}
    </>
  )
}
