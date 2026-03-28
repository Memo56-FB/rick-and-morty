'use client'

import { useState } from 'react'
import type { FavoriteCharacter } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import type { MobileCharacterCarouselItem } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import { DesktopCharacterFeature } from './DesktopCharacterFeature/DesktopCharacterFeature'
import { DesktopCharacterSidebar } from './DesktopCharacterSidebar/DesktopCharacterSidebar'
import styles from './DesktopCharacterShowcase.module.css'

type DesktopCharacterShowcaseProps = {
  characters: MobileCharacterCarouselItem[]
  favorites: FavoriteCharacter[]
}

const PAGE_SIZE = 4

export const DesktopCharacterShowcase = ({
  characters,
  favorites,
}: DesktopCharacterShowcaseProps) => {
  const [pageIndex, setPageIndex] = useState(0)

  if (characters.length === 0) {
    return null
  }

  const totalPages = Math.ceil(characters.length / PAGE_SIZE)
  const pageStart = pageIndex * PAGE_SIZE
  const visibleCharacters = characters.slice(pageStart, pageStart + PAGE_SIZE)
  const currentCharacter = visibleCharacters[0] ?? characters[0]

  const handlePreviousPage = () => {
    setPageIndex((previousPageIndex) => {
      const nextPageIndex = previousPageIndex === 0 ? totalPages - 1 : previousPageIndex - 1
      return nextPageIndex
    })
  }

  const handleNextPage = () => {
    setPageIndex((previousPageIndex) => {
      const nextPageIndex = previousPageIndex === totalPages - 1 ? 0 : previousPageIndex + 1
      return nextPageIndex
    })
  }

  return (
    <section className={styles.desktopShowcase} aria-label='Desktop character showcase'>
      <div className={styles.board}>
        <DesktopCharacterFeature character={currentCharacter} />
        <DesktopCharacterSidebar
          characters={visibleCharacters}
          favorites={favorites}
          showPager={totalPages > 1}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </section>
  )
}
