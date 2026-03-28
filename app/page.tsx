import Image from 'next/image';
import image from '../public/Rick_and_Morty.svg'
import { mockCharacters } from '@/app/mocks/characters'
import { MobileCharacterCarousel } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'
import { FavoritesPanel } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'

const favoriteCharacters = mockCharacters.slice(0, 4).map(({ id, name }) => ({
  id,
  name,
}))

export default function Home() {
  return (
    <section className='flex min-h-full w-full flex-col items-center px-4'>
      <Image
        src={image}
        alt='rick y morty'
        width={332}
        height={101}
        loading='eager'
        className='mt-8'
      />

      <div className='mt-6'>
        <CharacterSearch />
      </div>


      <div className='mt-10 flex flex-wrap items-start justify-center gap-2.5'>
        <CharacterCard
          name='Rick'
          imageSrc='/characters/rick.jpeg'
          selected
          favorite
        />
        <CharacterCard
          name='Morty'
          imageSrc='/characters/morty.jpeg'
        />
      </div>
      <div className='mt-8 w-full grid place-items-center'>
        <MobileCharacterCarousel characters={mockCharacters} />
      </div>

      <div className='mt-auto w-full grid place-items-center pt-8 self-end'>
        <FavoritesPanel favorites={favoriteCharacters} />
      </div>
    </section>
  );
}
