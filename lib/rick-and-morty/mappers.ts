import type {
  RickAndMortyApiCharacter,
  RickAndMortyCharacter,
} from '@/types/rick-and-morty'

export const mapApiCharacterToCharacter = (
  character: RickAndMortyApiCharacter
): RickAndMortyCharacter => {
  return {
    id: character.id,
    name: character.name,
    status: character.status,
    species: character.species,
    type: character.type,
    gender: character.gender,
    origin: character.origin,
    location: character.location,
    image: character.image,
    episode: character.episode,
  }
}
