import Image from 'next/image';
import image from '../public/Rick_and_Morty.svg'
import { mockCharacters } from '@/app/mocks/characters'
import { DesktopCharacterShowcase } from '@/app/components/cards/DesktopCharacterShowcase/DesktopCharacterShowcase'
import { MobileCharacterCarouselContainer } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarouselContainer'
import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'
import { FavoritesPanel } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'
import { getCharactersPage } from '@/lib/rick-and-morty/rick-and-morty.service'

const favoriteCharacters = mockCharacters.slice(0, 4).map(({ id, name }) => ({
  id,
  name,
}))

export default async function Home() {
  const initialCharactersPage = await getCharactersPage()

  return (
    <section className='flex min-h-full w-full flex-col items-center px-4 md:px-8'>
      <div className='mt-8 flex w-full justify-center md:mt-10 md:max-w-6xl md:justify-end md:pr-12'>
        <Image
          src={image}
          alt='rick y morty'
          width={332}
          height={101}
          loading='eager'
          className='h-auto'
        />
      </div>

      <div className='mt-6 md:hidden'>
        <CharacterSearch />
      </div>


      <div className='mt-10 flex flex-wrap items-start justify-center gap-2.5 md:hidden'>
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
      <div className='mt-8 w-full grid place-items-center md:hidden'>
        <MobileCharacterCarouselContainer
          initialCharactersPage={initialCharactersPage}
        />
      </div>

      <div className='hidden w-full flex-1 items-center justify-center py-8 md:relative md:z-20 md:-mb-24 md:flex md:py-12'>
        <DesktopCharacterShowcase
          characters={mockCharacters}
          favorites={favoriteCharacters}
        />
      </div>

      <div className='mt-auto w-full grid place-items-center pt-8 self-end md:hidden'>
        <FavoritesPanel favorites={favoriteCharacters} />
      </div>
    </section>
  );
}
