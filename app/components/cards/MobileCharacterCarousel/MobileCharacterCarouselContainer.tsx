'use client'

import { useEffect, useState, useTransition } from 'react'
import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'
import { MobileCharacterCarousel } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import { getAdjacentCharactersPage } from '@/lib/rick-and-morty/rick-and-morty.service'
import type { CharactersPage } from '@/types/rick-and-morty'

type MobileCharacterCarouselContainerProps = {
  initialCharactersPage: CharactersPage
}

type PrefetchedNextPage = {
  sourcePage: number
  page: CharactersPage
}

export const MobileCharacterCarouselContainer = ({
  initialCharactersPage,
}: MobileCharacterCarouselContainerProps) => {
  const [charactersPage, setCharactersPage] = useState(initialCharactersPage)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prefetchedNextPage, setPrefetchedNextPage] =
    useState<PrefetchedNextPage | null>(null)
  const [isLoadingPage, startTransition] = useTransition()

  const handlePageChange = async (direction: 'next' | 'prev') => {
    if (isLoadingPage) {
      return
    }

    const nextPage = await getAdjacentCharactersPage(direction, charactersPage.info)

    if (!nextPage) {
      return
    }

    startTransition(() => {
      setCharactersPage(nextPage)
      setCurrentIndex(direction === 'next' ? 0 : nextPage.results.length - 1)
      setPrefetchedNextPage(null)
    })
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previousIndex) => previousIndex - 1)
      return
    }

    if (charactersPage.info.prev) {
      void handlePageChange('prev')
    }
  }

  const handleNext = () => {
    if (currentIndex < charactersPage.results.length - 1) {
      setCurrentIndex((previousIndex) => previousIndex + 1)
      return
    }

    if (prefetchedNextPage?.sourcePage === charactersPage.page) {
      startTransition(() => {
        setCharactersPage(prefetchedNextPage.page)
        setCurrentIndex(0)
        setPrefetchedNextPage(null)
      })
      return
    }

    if (charactersPage.info.next) {
      void handlePageChange('next')
    }
  }

  const currentCharacter = charactersPage.results[currentIndex]
  const nextCharacterFromCurrentPage = charactersPage.results[currentIndex + 1]
  const nextCharacter = nextCharacterFromCurrentPage
    ?? (prefetchedNextPage?.sourcePage === charactersPage.page
      ? prefetchedNextPage.page.results[0] ?? null
      : null)

  useEffect(() => {
    const shouldPrefetchNextPage = !nextCharacterFromCurrentPage && Boolean(charactersPage.info.next)

    if (!shouldPrefetchNextPage) {
      return
    }

    if (prefetchedNextPage?.sourcePage === charactersPage.page) {
      return
    }

    let isCancelled = false

    void getAdjacentCharactersPage('next', charactersPage.info).then((nextPage) => {
      if (isCancelled || !nextPage) {
        return
      }

      setPrefetchedNextPage({
        sourcePage: charactersPage.page,
        page: nextPage,
      })
    })

    return () => {
      isCancelled = true
    }
  }, [
    charactersPage.info,
    charactersPage.page,
    nextCharacterFromCurrentPage,
    prefetchedNextPage,
  ])

  if (!currentCharacter) {
    return null
  }

  return (
    <>
      <div className='mt-10 grid grid-cols-2 gap-2.5'>
        <CharacterCard
          name={currentCharacter.name}
          imageSrc={currentCharacter.image}
          selected
        />
        {nextCharacter ? (
          <CharacterCard
            name={nextCharacter.name}
            imageSrc={nextCharacter.image}
          />
        ) : (
          <div
            aria-hidden='true'
            className='pointer-events-none invisible'
          >
            <CharacterCard
              name={currentCharacter.name}
              imageSrc={currentCharacter.image}
            />
          </div>
        )}
      </div>

      <div className='mt-8 w-full grid place-items-center'>
        <MobileCharacterCarousel
          key={charactersPage.page}
          characters={charactersPage.results}
          currentIndex={currentIndex}
          isPageLoading={isLoadingPage}
          onRequestNext={handleNext}
          onRequestPrevious={handlePrevious}
        />
      </div>
    </>
  )
}
