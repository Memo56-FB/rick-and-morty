'use client'

import { useState, useTransition } from 'react'
import { MobileCharacterCarousel } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import { getAdjacentCharactersPage } from '@/lib/rick-and-morty/rick-and-morty.service'
import type { CharactersPage } from '@/types/rick-and-morty'

type MobileCharacterCarouselContainerProps = {
  initialCharactersPage: CharactersPage
}

export const MobileCharacterCarouselContainer = ({
  initialCharactersPage,
}: MobileCharacterCarouselContainerProps) => {
  const [charactersPage, setCharactersPage] = useState(initialCharactersPage)
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
    })
  }

  return (
    <MobileCharacterCarousel
      key={charactersPage.page}
      characters={charactersPage.results}
      hasNextPage={Boolean(charactersPage.info.next)}
      hasPreviousPage={Boolean(charactersPage.info.prev)}
      isPageLoading={isLoadingPage}
      onRequestNextPage={() => handlePageChange('next')}
      onRequestPreviousPage={() => handlePageChange('prev')}
    />
  )
}
