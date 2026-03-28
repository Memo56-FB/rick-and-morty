'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { FavoritesPanel, type FavoriteCharacter } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'
import { OverflowTooltipText } from '@/app/components/ui/OverflowTooltipText/OverflowTooltipText'
import type { MobileCharacterCarouselItem } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import styles from './DesktopCharacterShowcase.module.css'

type DesktopCharacterShowcaseProps = {
  characters: MobileCharacterCarouselItem[]
  favorites: FavoriteCharacter[]
}

const PAGE_SIZE = 4

const getStatusClassName = (status: MobileCharacterCarouselItem['status']) => {
  if (status === 'Alive') return styles.alive
  if (status === 'Dead') return styles.dead
  return styles.unknown
}

const getSubtitle = (character: MobileCharacterCarouselItem) => {
  const parts = [character.species, character.type].filter(Boolean)
  return parts.join(' ')
}

type DesktopArrowIconProps = {
  direction: 'up' | 'down'
}

const DesktopArrowIcon = ({ direction }: DesktopArrowIconProps) => {
  const className = direction === 'up'
    ? `${styles.pagerIcon} ${styles.pagerIconUp}`
    : styles.pagerIcon

  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={className}
      fill='none'
    >
      <path
        d='M8 5.5L15 12L8 18.5'
        stroke='currentColor'
        strokeWidth='4'
      />
    </svg>
  )
}

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
  const statusClassName = getStatusClassName(currentCharacter.status)
  const subtitle = getSubtitle(currentCharacter)

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
        <div className={styles.featureColumn}>
          <div className={styles.featureFrame}>
            <div className={styles.statusBadge}>
              <span className={`${styles.statusDot} ${statusClassName}`} />
              <OverflowTooltipText
                text={currentCharacter.status}
                className={styles.statusText}
                wrapperClassName={styles.statusTextWrapper}
              />
            </div>

            <Image
              src={currentCharacter.image}
              alt={currentCharacter.name}
              fill
              sizes='(min-width: 768px) 40vw, 0vw'
              className={styles.featureImage}
            />

            <div className={styles.featureOverlay}>
              <OverflowTooltipText
                text={currentCharacter.name}
                as='h2'
                className={styles.featureName}
              />

              <OverflowTooltipText
                text={subtitle}
                as='p'
                className={styles.featureSubtitle}
              />

              <div className={styles.featureDetails}>
                <div>
                  <p className={styles.detailLabel}>Origin</p>
                  <OverflowTooltipText
                    text={currentCharacter.origin.name}
                    as='p'
                    className={styles.detailValue}
                  />
                </div>
                <div>
                  <p className={styles.detailLabel}>Location</p>
                  <OverflowTooltipText
                    text={currentCharacter.location.name}
                    as='p'
                    className={styles.detailValue}
                  />
                </div>
                <div>
                  <p className={styles.detailLabel}>Gender</p>
                  <OverflowTooltipText
                    text={currentCharacter.gender}
                    as='p'
                    className={styles.detailValue}
                  />
                </div>
                <div>
                  <p className={styles.detailLabel}>Episodes</p>
                  <OverflowTooltipText
                    text={String(currentCharacter.episode.length)}
                    as='p'
                    className={styles.detailValue}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.searchSlot}>
            <CharacterSearch />
          </div>

          <div className={styles.cardArea}>
            <div className={styles.cardGrid}>
              {visibleCharacters.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  name={character.name}
                  imageSrc={character.image}
                  selected={index === 0}
                  favorite={favorites.some((favoriteCharacter) => favoriteCharacter.id === character.id)}
                  size='desktop'
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className={styles.pager}>
                <button
                  type='button'
                  className={styles.pagerButton}
                  onClick={handlePreviousPage}
                  aria-label='Show previous group of characters'
                >
                  <DesktopArrowIcon direction='up' />
                </button>

                <button
                  type='button'
                  className={styles.pagerButton}
                  onClick={handleNextPage}
                  aria-label='Show next group of characters'
                >
                  <DesktopArrowIcon direction='down' />
                </button>
              </div>
            ) : null}
          </div>

          <div className={styles.favoritesDock}>
            <FavoritesPanel
              favorites={favorites}
              className={styles.favoritesPanel}
              desktopVisible
            />
          </div>
        </aside>
      </div>
    </section>
  )
}
