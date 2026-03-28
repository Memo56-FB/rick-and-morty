'use client'

import type { KeyboardEvent } from 'react'
import Image from 'next/image'
import favoriteIcon from '@/app/assets/favorite_icon.svg'
import { OverflowTooltipText } from '@/app/components/ui/OverflowTooltipText/OverflowTooltipText'
import styles from './CharacterCard.module.css'

type CharacterCardProps = {
  name: string
  imageSrc: string
  selected?: boolean
  favorite?: boolean
  size?: 'default' | 'desktop'
  onSelect?: () => void
}

export const CharacterCard = ({
  name,
  imageSrc,
  selected = false,
  favorite = false,
  size = 'default',
  onSelect,
}: CharacterCardProps) => {
  const cardClassName = [
    styles.card,
    selected ? styles.selected : '',
    size === 'desktop' ? styles.desktop : '',
    onSelect ? styles.interactive : '',
  ].filter(Boolean).join(' ')
  const favoriteRowClassName = [styles.favoriteRow, favorite ? styles.favorite : ''].filter(Boolean).join(' ')
  const favoriteLabel = favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`
  const isInteractive = Boolean(onSelect)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onSelect) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <article
      className={cardClassName}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? selected : undefined}
    >
      <OverflowTooltipText
        text={name}
        as='h2'
        className={styles.title}
      />

      <div className={styles.imageFrame}>
        <Image
          src={imageSrc}
          alt={name}
          width={100}
          height={100}
          className={styles.image}
        />
      </div>

      <div className={favoriteRowClassName}>
        <button
          type="button"
          aria-label={favoriteLabel}
          aria-pressed={favorite}
          className={styles.favoriteButton}
        >
          <span
            aria-hidden="true"
            className={styles.favoriteIcon}
            style={{ ['--favorite-icon' as string]: `url(${favoriteIcon.src})` }}
          />
        </button>
        <span>Like</span>
      </div>
    </article>
  )
}
