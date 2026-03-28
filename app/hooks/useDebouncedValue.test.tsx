import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately and updates after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 600),
      {
        initialProps: { value: 'rick' },
      }
    )

    expect(result.current).toBe('rick')

    rerender({ value: 'morty' })
    expect(result.current).toBe('rick')

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(result.current).toBe('morty')
  })
})
