'use client'

import { type RefObject, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
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

type OverflowTooltipTextProps = {
  text: string
  as?: 'span' | 'p' | 'h2'
  className: string
  wrapperClassName?: string
}

const OverflowTooltipText = ({
  text,
  as = 'span',
  className,
  wrapperClassName = '',
}: OverflowTooltipTextProps) => {
  const textRef = useRef<HTMLElement | null>(null)
  const tooltipId = useId()
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const element = textRef.current

    if (!element) {
      return
    }

    const checkOverflow = () => {
      setIsOverflowing(
        element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight
      )
    }

    checkOverflow()

    const resizeObserver = new ResizeObserver(checkOverflow)
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [text])

  useEffect(() => {
    if (!isTooltipOpen) {
      return
    }

    const updateTooltipPosition = () => {
      const element = textRef.current

      if (!element) {
        return
      }

      const rect = element.getBoundingClientRect()
      setTooltipPosition({
        top: Math.max(rect.top - 10, 8),
        left: rect.left + rect.width / 2,
      })
    }

    updateTooltipPosition()

    window.addEventListener('resize', updateTooltipPosition)
    window.addEventListener('scroll', updateTooltipPosition, true)

    return () => {
      window.removeEventListener('resize', updateTooltipPosition)
      window.removeEventListener('scroll', updateTooltipPosition, true)
    }
  }, [isTooltipOpen])

  const Component = as
  const shouldShowTooltip = isOverflowing && isTooltipOpen

  const openTooltip = () => {
    if (isOverflowing) {
      setIsTooltipOpen(true)
    }
  }

  const closeTooltip = () => {
    setIsTooltipOpen(false)
  }

  return (
    <span
      className={`${styles.tooltipTrigger} ${wrapperClassName}`.trim()}
      tabIndex={isOverflowing ? 0 : -1}
      aria-describedby={isOverflowing ? tooltipId : undefined}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onFocus={openTooltip}
      onBlur={closeTooltip}
    >
      {Component === 'h2' ? (
        <h2 ref={textRef as RefObject<HTMLHeadingElement>} className={className}>
          {text}
        </h2>
      ) : null}

      {Component === 'p' ? (
        <p ref={textRef as RefObject<HTMLParagraphElement>} className={className}>
          {text}
        </p>
      ) : null}

      {Component === 'span' ? (
        <span ref={textRef as RefObject<HTMLSpanElement>} className={className}>
          {text}
        </span>
      ) : null}

      {shouldShowTooltip && typeof document !== 'undefined'
        ? createPortal(
            <span
              id={tooltipId}
              role='tooltip'
              className={styles.tooltipBubble}
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
              }}
            >
              {text}
            </span>,
            document.body
          )
        : null}
    </span>
  )
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
