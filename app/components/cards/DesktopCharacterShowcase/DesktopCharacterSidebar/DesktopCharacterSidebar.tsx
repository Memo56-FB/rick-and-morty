import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { FavoritesPanel, type FavoriteCharacter } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'
import { DesktopCharacterPager } from '../DesktopCharacterPager/DesktopCharacterPager'
import styles from './DesktopCharacterSidebar.module.css'

type DesktopCharacterSidebarProps = {
  characters: RickAndMortyCharacter[]
  currentCharacterId: number
  favorites: FavoriteCharacter[]
  isLoadingPage?: boolean
  showPager: boolean
  onSelectCharacter: (characterId: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export const DesktopCharacterSidebar = ({
  characters,
  currentCharacterId,
  favorites,
  isLoadingPage = false,
  showPager,
  onSelectCharacter,
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
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              name={character.name}
              imageSrc={character.image}
              selected={character.id === currentCharacterId}
              favorite={favorites.some((favoriteCharacter) => favoriteCharacter.id === character.id)}
              size='desktop'
              onSelect={() => onSelectCharacter(character.id)}
            />
          ))}
        </div>

        {showPager ? (
          <DesktopCharacterPager
            disabled={isLoadingPage}
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
