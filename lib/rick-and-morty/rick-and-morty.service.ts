import { rickAndMortyHttpClient } from '@/lib/rick-and-morty/client'
import { mapApiCharacterToCharacter } from '@/lib/rick-and-morty/mappers'
import type {
  CharactersPage,
  RickAndMortyApiCharacter,
  RickAndMortyPaginatedResponse,
  RickAndMortyPaginationInfo,
} from '@/types/rick-and-morty'

const getPageNumberFromUrl = (url: string | null) => {
  if (!url) {
    return null
  }

  const parsedUrl = new URL(url)
  const page = parsedUrl.searchParams.get('page')

  if (!page) {
    return null
  }

  const pageNumber = Number(page)

  return Number.isNaN(pageNumber) ? null : pageNumber
}

export const getCharactersPage = async (page = 1): Promise<CharactersPage> => {
  const response = await rickAndMortyHttpClient.get<
    RickAndMortyPaginatedResponse<RickAndMortyApiCharacter>
  >('character', {
    params: { page },
  })

  return {
    page,
    info: response.info,
    results: response.results.map(mapApiCharacterToCharacter),
  }
}

export const getAdjacentCharactersPage = async (
  direction: 'next' | 'prev',
  info: RickAndMortyPaginationInfo
) => {
  const targetPage = getPageNumberFromUrl(
    direction === 'next' ? info.next : info.prev
  )

  if (!targetPage) {
    return null
  }

  return getCharactersPage(targetPage)
}

export const searchCharactersByName = async (name: string) => {
  const normalizedName = name.trim()

  if (!normalizedName) {
    return []
  }

  try {
    const response = await rickAndMortyHttpClient.get<
      RickAndMortyPaginatedResponse<RickAndMortyApiCharacter>
    >('character', {
      params: { name: normalizedName },
    })

    return response.results.map(mapApiCharacterToCharacter)
  } catch (error) {
    if (error instanceof Error && error.message.includes('There is nothing here')) {
      return []
    }

    throw error
  }
}
