import Image from 'next/image';
import image from '../public/Rick_and_Morty.svg'
import { DesktopCharacterShowcaseContainer } from '@/app/components/cards/DesktopCharacterShowcase/DesktopCharacterShowcaseContainer'
import { MobileCharacterCarouselContainer } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarouselContainer'
import { FavoritesPanelContainer } from '@/app/components/favorites/FavoritesPanel/FavoritesPanelContainer'
import { getCharactersPage } from '@/lib/rick-and-morty/rick-and-morty.service'

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

      <div className='md:hidden'>
        <MobileCharacterCarouselContainer
          initialCharactersPage={initialCharactersPage}
        />
      </div>

      <div className='hidden w-full flex-1 items-center justify-center py-8 md:relative md:z-20 md:-mb-24 md:flex md:py-12'>
        <DesktopCharacterShowcaseContainer
          initialCharactersPage={initialCharactersPage}
        />
      </div>

      <div className='mt-auto w-full grid place-items-center pt-8 self-end md:hidden'>
        <FavoritesPanelContainer />
      </div>
    </section>
  );
}
