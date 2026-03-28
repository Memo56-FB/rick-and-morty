import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FavoritesPanel } from '@/app/components/favorites/FavoritesPanel/FavoritesPanel'

describe('FavoritesPanel', () => {
  it('opens and renders the favorites list', async () => {
    const user = userEvent.setup()

    render(
      <FavoritesPanel
        favorites={[
          { id: '1', characterId: 1, name: 'Rick Sanchez', image: 'rick.png' },
        ]}
      />
    )

    await user.click(screen.getByRole('button', { name: /favs/i }))

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
  })

  it('calls onRemoveFavorite when deleting an item', async () => {
    const user = userEvent.setup()
    const onRemoveFavorite = vi.fn()

    render(
      <FavoritesPanel
        favorites={[
          { id: '1', characterId: 1, name: 'Rick Sanchez', image: 'rick.png' },
        ]}
        onRemoveFavorite={onRemoveFavorite}
      />
    )

    await user.click(screen.getByRole('button', { name: /favs/i }))
    await user.click(
      screen.getByRole('button', {
        name: 'Remove Rick Sanchez from favorites',
      })
    )

    expect(onRemoveFavorite).toHaveBeenCalledWith('1')
  })

  it('shows the limit note when there are more than four favorites', async () => {
    const user = userEvent.setup()

    render(
      <FavoritesPanel
        favorites={[
          { id: '1', characterId: 1, name: 'Rick Sanchez', image: 'rick.png' },
          { id: '2', characterId: 2, name: 'Morty Smith', image: 'morty.png' },
          { id: '3', characterId: 3, name: 'Summer Smith', image: 'summer.png' },
          { id: '4', characterId: 4, name: 'Beth Smith', image: 'beth.png' },
          { id: '5', characterId: 5, name: 'Jerry Smith', image: 'jerry.png' },
        ]}
      />
    )

    await user.click(screen.getByRole('button', { name: /favs/i }))

    expect(
      screen.getByText('Only the first 4 favorites are shown.')
    ).toBeInTheDocument()
  })
})
