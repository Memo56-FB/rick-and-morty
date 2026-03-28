import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CharacterSearch } from '@/app/components/search/CharacterSearch/CharacterSearch'

describe('CharacterSearch', () => {
  it('renders the controlled input value', () => {
    render(<CharacterSearch value='Rick' />)

    expect(
      screen.getByRole('searchbox', { name: 'Find your character' })
    ).toHaveValue('Rick')
  })

  it('calls onChange when the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <CharacterSearch
        value=''
        onChange={onChange}
      />
    )

    await user.type(
      screen.getByRole('searchbox', { name: 'Find your character' }),
      'Morty'
    )

    expect(onChange).toHaveBeenCalledTimes(5)
  })

  it('disables the search input when disabled is true', () => {
    render(
      <CharacterSearch
        value='Summer'
        disabled
      />
    )

    expect(
      screen.getByRole('searchbox', { name: 'Find your character' })
    ).toBeDisabled()
  })
})
