import Image from 'next/image';
import image from '../public/Rick_and_Morty.svg'
import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'

export default function Home() {
  return (
    <section className='grid place-items-center'>
      <Image
        src={image}
        alt='rick y morty'
        width={332}
        height={101}
        loading='eager'
        className='mt-8 px-4'
      />

      <div className='mt-6 px-4'>
        <CharacterSearch />
      </div>

      <div className='mt-10 flex flex-wrap items-start justify-center gap-2.5 px-4'>
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
    </section>
  );
}
