'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useState, useTransition } from 'react'
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue'
import { searchCharactersByName } from '@/lib/rick-and-morty/rick-and-morty.service'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'

const SEARCH_DEBOUNCE_MS = 600
const DESKTOP_GROUP_SIZE = 4

export const useDesktopCharacterSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<RickAndMortyCharacter[]>([])
  const [groupIndex, setGroupIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, startTransition] = useTransition()

  const normalizedQuery = searchQuery.trim()
  const debouncedSearchQuery = useDebouncedValue(normalizedQuery, SEARCH_DEBOUNCE_MS)
  const hasQuery = debouncedSearchQuery.length > 0
  const isSearchMode = hasQuery && results.length > 0

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextSearchQuery = event.target.value

    setSearchQuery(nextSearchQuery)

    if (nextSearchQuery.trim() === '') {
      setResults([])
      setGroupIndex(0)
      setIsSearching(false)
    } else {
      setIsSearching(true)
    }
  }

  const pageStart = groupIndex * DESKTOP_GROUP_SIZE
  const visibleCharacters = results.slice(
    pageStart,
    pageStart + DESKTOP_GROUP_SIZE
  )
  const hasMoreGroups = pageStart + DESKTOP_GROUP_SIZE < results.length

  const handlePreviousGroup = () => {
    if (groupIndex > 0) {
      setGroupIndex((previousGroupIndex) => previousGroupIndex - 1)
    }
  }

  const handleNextGroup = () => {
    if (hasMoreGroups) {
      setGroupIndex((previousGroupIndex) => previousGroupIndex + 1)
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
          setGroupIndex(0)
          setIsSearching(false)
        })
      })
      .catch(() => {
        if (isCancelled) {
          return
        }

        startTransition(() => {
          setResults([])
          setGroupIndex(0)
          setIsSearching(false)
        })
      })

    return () => {
      isCancelled = true
    }
  }, [debouncedSearchQuery, startTransition])

  return {
    characters: results,
    handleNextGroup,
    handlePreviousGroup,
    handleSearchChange,
    hasQuery,
    isSearchMode,
    isSearching: isSearching || isPending,
    searchQuery,
    showPager: results.length > DESKTOP_GROUP_SIZE,
    visibleCharacters,
  }
}
