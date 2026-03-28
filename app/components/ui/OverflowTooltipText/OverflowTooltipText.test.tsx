import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OverflowTooltipText } from '@/app/components/ui/OverflowTooltipText/OverflowTooltipText'

const mockElementMeasurements = ({
  clientWidth,
  scrollWidth,
  clientHeight = 20,
  scrollHeight = 20,
}: {
  clientWidth: number
  scrollWidth: number
  clientHeight?: number
  scrollHeight?: number
}) => {
  const clientWidthSpy = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth)
  const scrollWidthSpy = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth)
  const clientHeightSpy = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(clientHeight)
  const scrollHeightSpy = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(scrollHeight)

  return () => {
    clientWidthSpy.mockRestore()
    scrollWidthSpy.mockRestore()
    clientHeightSpy.mockRestore()
    scrollHeightSpy.mockRestore()
  }
}

describe('OverflowTooltipText', () => {
  it('does not open the tooltip when the text is not overflowing', async () => {
    const user = userEvent.setup()
    const restoreMeasurements = mockElementMeasurements({
      clientWidth: 120,
      scrollWidth: 120,
    })

    render(
      <OverflowTooltipText
        text='Rick Sanchez'
        className='truncate'
      />
    )

    const trigger = screen.getByText('Rick Sanchez').parentElement

    expect(trigger).toHaveAttribute('tabindex', '-1')

    await user.hover(trigger!)

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    restoreMeasurements()
  })

  it('opens the tooltip on hover when the text is overflowing', async () => {
    const user = userEvent.setup()
    const restoreMeasurements = mockElementMeasurements({
      clientWidth: 80,
      scrollWidth: 180,
    })

    render(
      <OverflowTooltipText
        text='A very long Rick and Morty character name'
        className='truncate'
      />
    )

    const trigger = screen.getByText('A very long Rick and Morty character name').parentElement

    expect(trigger).toHaveAttribute('tabindex', '0')

    await user.hover(trigger!)

    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'A very long Rick and Morty character name'
    )

    await user.unhover(trigger!)

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    restoreMeasurements()
  })

  it('supports rendering the text as a heading element', () => {
    const restoreMeasurements = mockElementMeasurements({
      clientWidth: 120,
      scrollWidth: 120,
    })

    render(
      <OverflowTooltipText
        text='Morty Smith'
        as='h2'
        className='title'
      />
    )

    expect(
      screen.getByRole('heading', { name: 'Morty Smith' })
    ).toBeInTheDocument()

    restoreMeasurements()
  })
})
