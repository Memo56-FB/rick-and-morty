import styles from './DesktopCharacterPager.module.css'

type DesktopCharacterPagerProps = {
  onPrevious: () => void
  onNext: () => void
}

type DesktopArrowIconProps = {
  direction: 'up' | 'down'
}

const DesktopArrowIcon = ({ direction }: DesktopArrowIconProps) => {
  const className = direction === 'up'
    ? `${styles.pagerIcon} ${styles.pagerIconUp}`
    : styles.pagerIcon

  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={className}
      fill='none'
    >
      <path
        d='M8 5.5L15 12L8 18.5'
        stroke='currentColor'
        strokeWidth='4'
      />
    </svg>
  )
}

export const DesktopCharacterPager = ({
  onPrevious,
  onNext,
}: DesktopCharacterPagerProps) => {
  return (
    <div className={styles.pager}>
      <button
        type='button'
        className={styles.pagerButton}
        onClick={onPrevious}
        aria-label='Show previous group of characters'
      >
        <DesktopArrowIcon direction='up' />
      </button>

      <button
        type='button'
        className={styles.pagerButton}
        onClick={onNext}
        aria-label='Show next group of characters'
      >
        <DesktopArrowIcon direction='down' />
      </button>
    </div>
  )
}
