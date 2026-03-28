'use client'

import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'

type MobileCharacterCardsPreviewProps = {
  currentCharacter: RickAndMortyCharacter
  nextCharacter: RickAndMortyCharacter | null
  favoriteCharacterIds: Set<number>
  isFavoritePending: (characterId: number) => boolean
  onToggleFavorite: (character: RickAndMortyCharacter) => void
}

export const MobileCharacterCardsPreview = ({
  currentCharacter,
  nextCharacter,
  favoriteCharacterIds,
  isFavoritePending,
  onToggleFavorite,
}: MobileCharacterCardsPreviewProps) => {
  return (
    <div
      className={nextCharacter
        ? 'mt-10 grid grid-cols-2 gap-2.5'
        : 'mt-10 grid grid-cols-1 place-items-center gap-2.5'}
    >
      <CharacterCard
        characterId={currentCharacter.id}
        name={currentCharacter.name}
        imageSrc={currentCharacter.image}
        selected
        favorite={favoriteCharacterIds.has(currentCharacter.id)}
        favoriteDisabled={isFavoritePending(currentCharacter.id)}
        onToggleFavorite={() => onToggleFavorite(currentCharacter)}
      />

      {nextCharacter ? (
        <CharacterCard
          characterId={nextCharacter.id}
          name={nextCharacter.name}
          imageSrc={nextCharacter.image}
          favorite={favoriteCharacterIds.has(nextCharacter.id)}
          favoriteDisabled={isFavoritePending(nextCharacter.id)}
          onToggleFavorite={() => onToggleFavorite(nextCharacter)}
        />
      ) : null}
    </div>
  )
}
