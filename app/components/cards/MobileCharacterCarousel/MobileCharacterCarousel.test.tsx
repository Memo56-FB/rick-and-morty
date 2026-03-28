import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileCharacterCarousel } from '@/app/components/cards/MobileCharacterCarousel/MobileCharacterCarousel'
import type { RickAndMortyCharacter } from '@/types/rick-and-morty'

const characters: RickAndMortyCharacter[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: 'Scientist',
    gender: 'Male',
    origin: {
      name: 'Earth (C-137)',
      url: 'https://rickandmortyapi.com/api/location/1',
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://rickandmortyapi.com/api/location/3',
    },
    image: 'rick.png',
    episode: ['1', '2', '3'],
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
      name: 'Earth (Replacement Dimension)',
      url: 'https://rickandmortyapi.com/api/location/20',
    },
    image: 'morty.png',
    episode: ['1', '2'],
  },
]

describe('MobileCharacterCarousel', () => {
  it('renders the current character information', () => {
    render(
      <MobileCharacterCarousel
        characters={characters}
        currentIndex={0}
      />
    )

    expect(
      screen.getByRole('heading', { name: 'Rick Sanchez' })
    ).toBeInTheDocument()
    expect(screen.getByText('Human Scientist')).toBeInTheDocument()
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument()
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls the navigation callbacks', async () => {
    const user = userEvent.setup()
    const onRequestPrevious = vi.fn()
    const onRequestNext = vi.fn()

    render(
      <MobileCharacterCarousel
        characters={characters}
        currentIndex={0}
        onRequestPrevious={onRequestPrevious}
        onRequestNext={onRequestNext}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Show previous character' })
    )
    await user.click(
      screen.getByRole('button', { name: 'Show next character' })
    )

    expect(onRequestPrevious).toHaveBeenCalledTimes(1)
    expect(onRequestNext).toHaveBeenCalledTimes(1)
  })

  it('hides navigation controls when navigation is disabled', () => {
    render(
      <MobileCharacterCarousel
        characters={[characters[1]]}
        currentIndex={0}
        showNavigation={false}
      />
    )

    expect(
      screen.queryByRole('button', { name: 'Show previous character' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Show next character' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Morty Smith' })
    ).toBeInTheDocument()
  })

  it('disables navigation while the page is loading', () => {
    render(
      <MobileCharacterCarousel
        characters={characters}
        currentIndex={0}
        isPageLoading
      />
    )

    expect(
      screen.getByRole('button', { name: 'Show previous character' })
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Show next character' })
    ).toBeDisabled()
    expect(
      screen.getByRole('region', { name: 'Character carousel' })
    ).toHaveAttribute('aria-busy', 'true')
  })

  it('renders nothing when there are no characters', () => {
    const { container } = render(
      <MobileCharacterCarousel
        characters={[]}
        currentIndex={0}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
