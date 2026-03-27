import Image from 'next/image';
import image from '../public/Rick_and_Morty.svg'
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
        className='mt-8'
      />

      <div className='mt-6 px-4'>
        <CharacterSearch />
      </div>
    </section>
  );
}
