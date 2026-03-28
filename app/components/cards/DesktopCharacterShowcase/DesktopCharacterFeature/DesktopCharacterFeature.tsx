import Image from 'next/image'
import { OverflowTooltipText } from '@/app/components/ui/OverflowTooltipText/OverflowTooltipText'
import type { MobileCharacterCarouselItem } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import styles from './DesktopCharacterFeature.module.css'

type DesktopCharacterFeatureProps = {
  character: MobileCharacterCarouselItem
}

const getStatusClassName = (status: MobileCharacterCarouselItem['status']) => {
  if (status === 'Alive') return styles.alive
  if (status === 'Dead') return styles.dead
  return styles.unknown
}

const getSubtitle = (character: MobileCharacterCarouselItem) => {
  const parts = [character.species, character.type].filter(Boolean)
  return parts.join(' ')
}

export const DesktopCharacterFeature = ({
  character,
}: DesktopCharacterFeatureProps) => {
  const statusClassName = getStatusClassName(character.status)
  const subtitle = getSubtitle(character)

  return (
    <div className={styles.featureColumn}>
      <div className={styles.featureFrame}>
        <div className={styles.statusBadge}>
          <span className={`${styles.statusDot} ${statusClassName}`} />
          <OverflowTooltipText
            text={character.status}
            className={styles.statusText}
            wrapperClassName={styles.statusTextWrapper}
          />
        </div>

        <Image
          src={character.image}
          alt={character.name}
          fill
          sizes='(min-width: 768px) 40vw, 0vw'
          className={styles.featureImage}
        />

        <div className={styles.featureOverlay}>
          <OverflowTooltipText
            text={character.name}
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
                text={character.origin.name}
                as='p'
                className={styles.detailValue}
              />
            </div>
            <div>
              <p className={styles.detailLabel}>Location</p>
              <OverflowTooltipText
                text={character.location.name}
                as='p'
                className={styles.detailValue}
              />
            </div>
            <div>
              <p className={styles.detailLabel}>Gender</p>
              <OverflowTooltipText
                text={character.gender}
                as='p'
                className={styles.detailValue}
              />
            </div>
            <div>
              <p className={styles.detailLabel}>Episodes</p>
              <OverflowTooltipText
                text={String(character.episode.length)}
                as='p'
                className={styles.detailValue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
