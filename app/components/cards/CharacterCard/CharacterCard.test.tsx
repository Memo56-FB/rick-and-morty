import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { CharacterCard } from '@/app/components/cards/CharacterCard/CharacterCard'

describe('CharacterCard', () => {
  it('calls onSelect on click and keyboard interaction', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <CharacterCard
        name='Rick Sanchez'
        imageSrc='rick.png'
        onSelect={onSelect}
      />
    )

    const card = screen.getByText('Rick Sanchez').closest('article')

    expect(card).not.toBeNull()

    await user.click(card!)
    card!.focus()
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it('calls onToggleFavorite without triggering onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onToggleFavorite = vi.fn()

    render(
      <CharacterCard
        characterId={1}
        name='Rick Sanchez'
        imageSrc='rick.png'
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Add Rick Sanchez to favorites',
      })
    )

    expect(onToggleFavorite).toHaveBeenCalledTimes(1)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('renders the remove label when the card is already favorite', () => {
    render(
      <CharacterCard
        name='Rick Sanchez'
        imageSrc='rick.png'
        favorite
      />
    )

    expect(
      screen.getByRole('button', {
        name: 'Remove Rick Sanchez from favorites',
      })
    ).toBeInTheDocument()
  })
})
