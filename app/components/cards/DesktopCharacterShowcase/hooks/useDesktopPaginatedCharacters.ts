'use client'

import { useEffect, useState, useTransition } from 'react'
import { getAdjacentCharactersPage } from '@/lib/rick-and-morty/rick-and-morty.service'
import type { CharactersPage } from '@/types/rick-and-morty'

const DESKTOP_GROUP_SIZE = 4

type PrefetchedNextPage = {
  sourcePage: number
  page: CharactersPage
}

type UseDesktopPaginatedCharactersOptions = {
  disabled?: boolean
}

const getLastGroupIndex = (resultsLength: number) => {
  if (resultsLength === 0) {
    return 0
  }

  return Math.floor((resultsLength - 1) / DESKTOP_GROUP_SIZE)
}

export const useDesktopPaginatedCharacters = (
  initialCharactersPage: CharactersPage,
  { disabled = false }: UseDesktopPaginatedCharactersOptions = {}
) => {
  const [charactersPage, setCharactersPage] = useState(initialCharactersPage)
  const [groupIndex, setGroupIndex] = useState(0)
  const [prefetchedNextPage, setPrefetchedNextPage] =
    useState<PrefetchedNextPage | null>(null)
  const [isPending, startTransition] = useTransition()

  const pageStart = groupIndex * DESKTOP_GROUP_SIZE
  const visibleCharacters = charactersPage.results.slice(
    pageStart,
    pageStart + DESKTOP_GROUP_SIZE
  )
  const currentCharacter = visibleCharacters[0] ?? charactersPage.results[0] ?? null
  const hasMoreGroupsInPage =
    pageStart + DESKTOP_GROUP_SIZE < charactersPage.results.length
  const showPager =
    charactersPage.results.length > DESKTOP_GROUP_SIZE
    || Boolean(charactersPage.info.next || charactersPage.info.prev)

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
      setGroupIndex(
        direction === 'next' ? 0 : getLastGroupIndex(nextPage.results.length)
      )
      setPrefetchedNextPage(null)
    })
  }

  const handlePreviousGroup = () => {
    if (disabled) {
      return
    }

    if (groupIndex > 0) {
      setGroupIndex((previousGroupIndex) => previousGroupIndex - 1)
      return
    }

    if (charactersPage.info.prev) {
      void handlePageChange('prev')
    }
  }

  const handleNextGroup = () => {
    if (disabled) {
      return
    }

    if (hasMoreGroupsInPage) {
      setGroupIndex((previousGroupIndex) => previousGroupIndex + 1)
      return
    }

    if (prefetchedNextPage?.sourcePage === charactersPage.page) {
      startTransition(() => {
        setCharactersPage(prefetchedNextPage.page)
        setGroupIndex(0)
        setPrefetchedNextPage(null)
      })
      return
    }

    if (charactersPage.info.next) {
      void handlePageChange('next')
    }
  }

  useEffect(() => {
    if (disabled) {
      return
    }

    const shouldPrefetchNextPage = !hasMoreGroupsInPage && Boolean(charactersPage.info.next)

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
    hasMoreGroupsInPage,
    prefetchedNextPage,
  ])

  return {
    currentCharacter,
    handleNextGroup,
    handlePreviousGroup,
    isLoadingPage: isPending,
    showPager,
    visibleCharacters,
  }
}
