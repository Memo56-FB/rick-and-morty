import Image from 'next/image';
import image from '../public/Rick_and_Morty.svg'
export default function Home() {
  return (
    <section>
      <Image
        src={image}
        alt='rick y morty'
        width={332}
        height={101}
        loading='eager'
        className='mx-auto mt-8'
      />
    </section>
  );
}
