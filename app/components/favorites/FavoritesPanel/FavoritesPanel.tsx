'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { OverflowTooltipText } from '@/app/components/ui/OverflowTooltipText/OverflowTooltipText'
import styles from './FavoritesPanel.module.css'

export type FavoriteCharacter = {
  id: number | string
  name: string
}

type FavoritesPanelProps = {
  favorites: FavoriteCharacter[]
  maxItems?: number
  emptyLabel?: string
  className?: string
  desktopVisible?: boolean
  onRemoveFavorite?: (favoriteId: FavoriteCharacter['id']) => void
}

const TrashIcon = () => {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={styles.removeIcon}
      fill='none'
    >
      <path
        d='M4 7H20'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
      <path
        d='M9 3.5H15'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
      <path
        d='M7.5 7V18.5C7.5 19.3284 8.17157 20 9 20H15C15.8284 20 16.5 19.3284 16.5 18.5V7'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10 10.25V16.25'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
      <path
        d='M14 10.25V16.25'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

export const FavoritesPanel = ({
  favorites,
  maxItems = 4,
  emptyLabel = 'No favorites yet',
  className = '',
  desktopVisible = false,
  onRemoveFavorite,
}: FavoritesPanelProps) => {
  const panelRef = useRef<HTMLElement | null>(null)
  const contentId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const visibleFavorites = favorites.slice(0, maxItems)
  const containerClassName = [
    styles.wrapper,
    desktopVisible ? styles.desktopVisible : '',
    className,
  ].filter(Boolean).join(' ')
  const hasOverflow = favorites.length > maxItems

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <section
      ref={panelRef}
      className={containerClassName}
      aria-label='Favorite characters'
    >
      {!isOpen ? (
        <button
          type='button'
          className={styles.summary}
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          <span className={styles.summaryTitle}>FAVS</span>
          <span className={styles.srOnly}>
            {visibleFavorites.length} of {maxItems} favorites
          </span>
        </button>
      ) : null}

      {isOpen ? (
        <div id={contentId} className={styles.content}>
          {visibleFavorites.length > 0 ? (
            <ul className={styles.list}>
              {visibleFavorites.map((favorite) => (
                <li key={favorite.id} className={styles.item}>
                  <OverflowTooltipText
                    text={favorite.name}
                    className={styles.favoriteName}
                    wrapperClassName={styles.favoriteNameWrapper}
                  />

                  <button
                    type='button'
                    className={styles.removeButton}
                    onClick={() => onRemoveFavorite?.(favorite.id)}
                    aria-label={`Remove ${favorite.name} from favorites`}
                    aria-disabled={!onRemoveFavorite}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyState}>{emptyLabel}</p>
          )}

          {hasOverflow ? (
            <p className={styles.limitNote}>
              Only the first {maxItems} favorites are shown.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
