import Image from 'next/image'
import searchIcon from '@/app/assets/search_icon.svg'
import userIcon from '@/app/assets/user_icon.svg'
import styles from './CharacterSearch.module.css'


export const CharacterSearch = () => {
  return (
    <form className={styles.searchForm} role="search" aria-label="Search characters">
      <label className={styles.searchLabel} htmlFor="findCharacter">
        Find your character
      </label>

      <Image
        src={searchIcon}
        alt="search icon"
        width={19.49}
        height={19.49}
        aria-hidden="true"
        className={styles.searchIcon}
      />

      <input
        id="findCharacter"
        name="findCharacter"
        type="search"
        placeholder="Find your character..."
        autoComplete="off"
        enterKeyHint="search"
        className={styles.searchInput}
      />

      <Image
        src={userIcon}
        alt="user icon"
        width={24.49}
        height={24.49}
        aria-hidden="true"
        className={styles.userIcon}
      />
    </form>
  )
}
