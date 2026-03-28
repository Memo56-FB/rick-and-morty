export type CharacterStatus = 'Alive' | 'Dead' | 'unknown' | string

export type CharacterLocation = {
  name: string
  url: string
}

export type RickAndMortyCharacter = {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: string
  origin: CharacterLocation
  location: CharacterLocation
  image: string
  episode: string[]
}

export type RickAndMortyApiCharacter = RickAndMortyCharacter & {
  url: string
  created: string
}

export type RickAndMortyPaginationInfo = {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export type RickAndMortyPaginatedResponse<TItem> = {
  info: RickAndMortyPaginationInfo
  results: TItem[]
}

export type CharactersPage = {
  page: number
  info: RickAndMortyPaginationInfo
  results: RickAndMortyCharacter[]
}
