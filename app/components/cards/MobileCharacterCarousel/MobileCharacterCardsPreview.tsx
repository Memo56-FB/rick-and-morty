'use client'

import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'

type MobileCharacterCardsPreviewProps = {
  currentCharacter: RickAndMortyCharacter
  nextCharacter: RickAndMortyCharacter | null
}

export const MobileCharacterCardsPreview = ({
  currentCharacter,
  nextCharacter,
}: MobileCharacterCardsPreviewProps) => {
  return (
    <div
      className={nextCharacter
        ? 'mt-10 grid grid-cols-2 gap-2.5'
        : 'mt-10 grid grid-cols-1 place-items-center gap-2.5'}
    >
      <CharacterCard
        name={currentCharacter.name}
        imageSrc={currentCharacter.image}
        selected
      />

      {nextCharacter ? (
        <CharacterCard
          name={nextCharacter.name}
          imageSrc={nextCharacter.image}
        />
      ) : null}
    </div>
  )
}
