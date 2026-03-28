'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useState, useTransition } from 'react'
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue'
import { searchCharactersByName } from '@/lib/rick-and-morty/rick-and-morty.service'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'

const SEARCH_DEBOUNCE_MS = 600

export const useMobileCharacterSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<RickAndMortyCharacter[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, startTransition] = useTransition()

  const normalizedQuery = searchQuery.trim()
  const debouncedSearchQuery = useDebouncedValue(normalizedQuery, SEARCH_DEBOUNCE_MS)
  const isSearchMode = debouncedSearchQuery.length > 0

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextSearchQuery = event.target.value

    setSearchQuery(nextSearchQuery)

    if (nextSearchQuery.trim() === '') {
      setResults([])
      setCurrentIndex(0)
      setIsSearching(false)
    } else {
      setIsSearching(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previousIndex) => previousIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < results.length - 1) {
      setCurrentIndex((previousIndex) => previousIndex + 1)
    }
  }

  useEffect(() => {
    if (!debouncedSearchQuery) {
      return
    }

    let isCancelled = false

    void searchCharactersByName(debouncedSearchQuery)
      .then((characters) => {
        if (isCancelled) {
          return
        }

        startTransition(() => {
          setResults(characters)
          setCurrentIndex(0)
          setIsSearching(false)
        })
      })
      .catch(() => {
        if (isCancelled) {
          return
        }

        startTransition(() => {
          setResults([])
          setCurrentIndex(0)
          setIsSearching(false)
        })
      })

    return () => {
      isCancelled = true
    }
  }, [debouncedSearchQuery, startTransition])

  const currentCharacter = results[currentIndex] ?? null
  const nextCharacter = results[currentIndex + 1] ?? null

  return {
    currentCharacter,
    currentIndex,
    characters: results,
    handleNext,
    handlePrevious,
    handleSearchChange,
    isSearchMode,
    isSearching: isSearching || isPending,
    nextCharacter,
    searchQuery,
    showNavigation: results.length > 1,
  }
}
