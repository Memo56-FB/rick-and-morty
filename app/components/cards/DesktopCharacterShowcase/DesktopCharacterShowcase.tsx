'use client'

import type { FavoriteCharacter } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'
import { DesktopCharacterFeature } from './DesktopCharacterFeature/DesktopCharacterFeature'
import { DesktopCharacterSidebar } from './DesktopCharacterSidebar/DesktopCharacterSidebar'
import styles from './DesktopCharacterShowcase.module.css'

type DesktopCharacterShowcaseProps = {
  characters: RickAndMortyCharacter[]
  currentCharacter: RickAndMortyCharacter
  favorites: FavoriteCharacter[]
  isLoadingPage?: boolean
  showPager: boolean
  onSelectCharacter: (characterId: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export const DesktopCharacterShowcase = ({
  characters,
  currentCharacter,
  favorites,
  isLoadingPage = false,
  showPager,
  onSelectCharacter,
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
          favorites={favorites}
          isLoadingPage={isLoadingPage}
          showPager={showPager}
          onSelectCharacter={onSelectCharacter}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </div>
    </section>
  )
}
