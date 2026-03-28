import type { MobileCharacterCarouselItem } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'

export const mockCharacters: MobileCharacterCarouselItem[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: "Rick's Toxic Side",
    gender: 'Male',
    origin: {
      name: 'Earth (C-137)',
      url: 'https://rickandmortyapi.com/api/location/1',
    },
    location: {
      name: 'Earth (Replacement Dimension)',
      url: 'https://rickandmortyapi.com/api/location/20',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: Array.from({ length: 51 }, (_, index) => `https://rickandmortyapi.com/api/episode/${index + 1}`),
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      name: 'unknown',
      url: '',
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://rickandmortyapi.com/api/location/3',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: Array.from({ length: 41 }, (_, index) => `https://rickandmortyapi.com/api/episode/${index + 1}`),
  },
  {
    id: 268,
    name: 'Poncho',
    status: 'Dead',
    species: 'Human',
    type: 'Anatomy Park worker with an unexpectedly long descriptor',
    gender: 'Male',
    origin: {
      name: 'unknown',
      url: '',
    },
    location: {
      name: 'Anatomy Park',
      url: 'https://rickandmortyapi.com/api/location/5',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/268.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/3'],
  },
  {
    id: 105,
    name: 'Long-Named Test Character for Tooltip Validation',
    status: 'unknown',
    species: 'Alien',
    type: 'Extremely Verbose Interdimensional Being',
    gender: 'Genderless',
    origin: {
      name: 'Interdimensional Cable Broadcasting Studio With Extra Long Name',
      url: 'https://rickandmortyapi.com/api/location/6',
    },
    location: {
      name: 'Planet Squanch Oversight Territory',
      url: 'https://rickandmortyapi.com/api/location/35',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/105.jpeg',
    episode: Array.from({ length: 7 }, (_, index) => `https://rickandmortyapi.com/api/episode/${index + 10}`),
  },
]
