import Image from 'next/image'
import image from '../../../../public/rick_morty_standing.png'
import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Image
        src={image}
        alt="rick and morty standing"
        width={200}
        height={259}
        className={styles.backgroundImage}
        loading='eager'
      />
      <div className={styles.gradientBar} />
    </footer>
  )
}
