import type { ChangeEventHandler } from 'react'
import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { FavoritesPanelContainer } from '@/app/components/favorites/FavoritesPanel/FavoritesPanelContainer'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'
import { DesktopCharacterPager } from '../DesktopCharacterPager/DesktopCharacterPager'
import styles from './DesktopCharacterSidebar.module.css'

type DesktopCharacterSidebarProps = {
  characters: RickAndMortyCharacter[]
  currentCharacterId: number
  favoriteCharacterIds: Set<number>
  isLoadingPage?: boolean
  isFavoritePending: (characterId: number) => boolean
  searchQuery: string
  showPager: boolean
  onSearchChange: ChangeEventHandler<HTMLInputElement>
  onSelectCharacter: (characterId: number) => void
  onToggleFavorite: (character: RickAndMortyCharacter) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export const DesktopCharacterSidebar = ({
  characters,
  currentCharacterId,
  favoriteCharacterIds,
  isLoadingPage = false,
  isFavoritePending,
  searchQuery,
  showPager,
  onSearchChange,
  onSelectCharacter,
  onToggleFavorite,
  onPreviousPage,
  onNextPage,
}: DesktopCharacterSidebarProps) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.searchSlot}>
        <CharacterSearch
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      <div className={styles.cardArea}>
        <div className={styles.cardGrid}>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              characterId={character.id}
              name={character.name}
              imageSrc={character.image}
              selected={character.id === currentCharacterId}
              favorite={favoriteCharacterIds.has(character.id)}
              favoriteDisabled={isFavoritePending(character.id)}
              size='desktop'
              onSelect={() => onSelectCharacter(character.id)}
              onToggleFavorite={() => onToggleFavorite(character)}
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
        <FavoritesPanelContainer
          className={styles.favoritesPanel}
          desktopVisible
        />
      </div>
    </aside>
  )
}
