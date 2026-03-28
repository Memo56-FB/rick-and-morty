'use client'

import type { ChangeEventHandler } from 'react'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'
import { DesktopCharacterFeature } from './DesktopCharacterFeature/DesktopCharacterFeature'
import { DesktopCharacterSidebar } from './DesktopCharacterSidebar/DesktopCharacterSidebar'
import styles from './DesktopCharacterShowcase.module.css'

type DesktopCharacterShowcaseProps = {
  characters: RickAndMortyCharacter[]
  currentCharacter: RickAndMortyCharacter
  favoriteCharacterIds: Set<number>
  isLoadingPage?: boolean
  searchQuery: string
  showPager: boolean
  isFavoritePending: (characterId: number) => boolean
  onSearchChange: ChangeEventHandler<HTMLInputElement>
  onSelectCharacter: (characterId: number) => void
  onToggleFavorite: (character: RickAndMortyCharacter) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export const DesktopCharacterShowcase = ({
  characters,
  currentCharacter,
  favoriteCharacterIds,
  isLoadingPage = false,
  searchQuery,
  showPager,
  isFavoritePending,
  onSearchChange,
  onSelectCharacter,
  onToggleFavorite,
  onPreviousPage,
  onNextPage,
}: DesktopCharacterShowcaseProps) => {
  return (
    <section className={styles.desktopShowcase} aria-label='Desktop character showcase'>
      <div className={styles.board}>
        <DesktopCharacterFeature character={currentCharacter} />
        <DesktopCharacterSidebar
          characters={characters}
          currentCharacterId={currentCharacter.id}
          favoriteCharacterIds={favoriteCharacterIds}
          isLoadingPage={isLoadingPage}
          isFavoritePending={isFavoritePending}
          searchQuery={searchQuery}
          showPager={showPager}
          onSearchChange={onSearchChange}
          onSelectCharacter={onSelectCharacter}
          onToggleFavorite={onToggleFavorite}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </div>
    </section>
  )
}
