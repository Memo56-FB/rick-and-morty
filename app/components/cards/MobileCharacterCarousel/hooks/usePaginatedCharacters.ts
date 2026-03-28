'use client'

import { useEffect, useState, useTransition } from 'react'
import { getAdjacentCharactersPage } from '@/lib/rick-and-morty/rick-and-morty.service'
import type { CharactersPage } from '@/types/rick-and-morty'

type PrefetchedNextPage = {
  sourcePage: number
  page: CharactersPage
}

type UsePaginatedCharactersOptions = {
  disabled?: boolean
}

export const usePaginatedCharacters = (
  initialCharactersPage: CharactersPage,
  { disabled = false }: UsePaginatedCharactersOptions = {}
) => {
  const [charactersPage, setCharactersPage] = useState(initialCharactersPage)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prefetchedNextPage, setPrefetchedNextPage] =
    useState<PrefetchedNextPage | null>(null)
  const [isPending, startTransition] = useTransition()

  const handlePageChange = async (direction: 'next' | 'prev') => {
    if (isPending || disabled) {
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
    if (disabled) {
      return
    }

    if (currentIndex > 0) {
      setCurrentIndex((previousIndex) => previousIndex - 1)
      return
    }

    if (charactersPage.info.prev) {
      void handlePageChange('prev')
    }
  }

  const handleNext = () => {
    if (disabled) {
      return
    }

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

  const currentCharacter = charactersPage.results[currentIndex] ?? null
  const nextCharacterFromCurrentPage = charactersPage.results[currentIndex + 1]
  const nextCharacter = nextCharacterFromCurrentPage
    ?? (prefetchedNextPage?.sourcePage === charactersPage.page
      ? prefetchedNextPage.page.results[0] ?? null
      : null)

  useEffect(() => {
    if (disabled) {
      return
    }

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
    disabled,
    nextCharacterFromCurrentPage,
    prefetchedNextPage,
  ])

  return {
    characters: charactersPage.results,
    currentCharacter,
    currentIndex,
    handleNext,
    handlePrevious,
    isLoadingPage: isPending,
    nextCharacter,
    showNavigation:
      charactersPage.results.length > 1
      || Boolean(charactersPage.info.next || charactersPage.info.prev),
  }
}
