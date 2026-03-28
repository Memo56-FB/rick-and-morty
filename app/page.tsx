import Image from 'next/image'
import image from '../public/Rick_and_Morty.svg'
import { DesktopCharacterShowcaseContainer } from '@/app/components/cards/DesktopCharacterShowcase/DesktopCharacterShowcaseContainer'
import { MobileCharacterCarouselContainer } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarouselContainer'
import { FavoritesPanelContainer } from '@/app/components/favorites/FavoritesPanel/FavoritesPanelContainer'
import { getCharactersPage } from '@/lib/rick-and-morty/rick-and-morty.service'
import styles from './page.module.css'

export default async function Home() {
  const initialCharactersPage = await getCharactersPage()

  return (
    <section className={styles.page}>
      <div className={styles.logoWrapper}>
        <Image
          src={image}
          alt='rick y morty'
          width={332}
          height={101}
          loading='eager'
          className={styles.logo}
        />
      </div>

      <div className={styles.mobileContent}>
        <MobileCharacterCarouselContainer
          initialCharactersPage={initialCharactersPage}
        />
      </div>

      <div className={styles.desktopContent}>
        <DesktopCharacterShowcaseContainer
          initialCharactersPage={initialCharactersPage}
        />
      </div>

      <div className={styles.favorites}>
        <FavoritesPanelContainer />
      </div>
    </section>
  )
}
