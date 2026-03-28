'use client'

import { useState } from 'react'
import Image from 'next/image'
import { OverflowTooltipText } from '@/app/components/ui/OverflowTooltipText/OverflowTooltipText'
import styles from './MobileCharacterCarousel.module.css'

type CharacterStatus = 'Alive' | 'Dead' | 'unknown' | string

type CharacterLocation = {
  name: string
  url: string
}

export type MobileCharacterCarouselItem = {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: string
  origin: CharacterLocation
  location: CharacterLocation
  image: string
  episode: string[]
}

type MobileCharacterCarouselProps = {
  characters: MobileCharacterCarouselItem[]
}

const getStatusClassName = (status: CharacterStatus) => {
  if (status === 'Alive') return styles.alive
  if (status === 'Dead') return styles.dead
  return styles.unknown
}

const getSubtitle = (character: MobileCharacterCarouselItem) => {
  const parts = [character.species, character.type].filter(Boolean)
  return parts.join(' ')
}

type CarouselArrowIconProps = {
  direction: 'left' | 'right'
}

const CarouselArrowIcon = ({ direction }: CarouselArrowIconProps) => {
  const className = direction === 'left'
    ? `${styles.carouselNavIcon} ${styles.carouselNavIconPrev}`
    : styles.carouselNavIcon

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

export const MobileCharacterCarousel = ({ characters }: MobileCharacterCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (characters.length === 0) {
    return null
  }

  const currentCharacter = characters[currentIndex]
  const statusClassName = getStatusClassName(currentCharacter.status)
  const subtitle = getSubtitle(currentCharacter)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? characters.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === characters.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <section className={styles.carousel} aria-label='Character carousel'>
      <button
        type='button'
        className={`${styles.carouselNavButton} ${styles.carouselNavPrevious}`}
        onClick={handlePrevious}
        aria-label='Show previous character'
      >
        <CarouselArrowIcon direction='left' />
      </button>

      <div className={styles.carouselViewport}>
        <div className={styles.imageFrame}>
          <div className={styles.statusBadge}>
            <span className={`${styles.statusDot} ${statusClassName}`} />
            <OverflowTooltipText
              text={currentCharacter.status}
              className={styles.statusText}
              wrapperClassName={styles.statusTextContainer}
            />
          </div>

          <Image
            src={currentCharacter.image}
            alt={currentCharacter.name}
            fill
            sizes='(max-width: 767px) 100vw, 0vw'
            className={styles.characterImage}
          />

          <div className={styles.contentOverlay}>
            <OverflowTooltipText
              text={currentCharacter.name}
              as='h2'
              className={styles.characterName}
            />
            <OverflowTooltipText
              text={subtitle}
              as='p'
              className={styles.characterSubtitle}
            />

            <div className={styles.detailsGrid}>
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

      <button
        type='button'
        className={`${styles.carouselNavButton} ${styles.carouselNavNext}`}
        onClick={handleNext}
        aria-label='Show next character'
      >
        <CarouselArrowIcon direction='right' />
      </button>
    </section>
  )
}
