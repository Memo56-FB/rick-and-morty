import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { FavoritesPanel, type FavoriteCharacter } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'
import type { MobileCharacterCarouselItem } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import { DesktopCharacterPager } from '../DesktopCharacterPager/DesktopCharacterPager'
import styles from './DesktopCharacterSidebar.module.css'

type DesktopCharacterSidebarProps = {
  characters: MobileCharacterCarouselItem[]
  favorites: FavoriteCharacter[]
  showPager: boolean
  onPreviousPage: () => void
  onNextPage: () => void
}

export const DesktopCharacterSidebar = ({
  characters,
  favorites,
  showPager,
  onPreviousPage,
  onNextPage,
}: DesktopCharacterSidebarProps) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.searchSlot}>
        <CharacterSearch />
      </div>

      <div className={styles.cardArea}>
        <div className={styles.cardGrid}>
          {characters.map((character, index) => (
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

        {showPager ? (
          <DesktopCharacterPager
            onPrevious={onPreviousPage}
            onNext={onNextPage}
          />
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
  )
}
