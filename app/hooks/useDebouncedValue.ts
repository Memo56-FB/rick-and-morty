'use client'

import { useEffect, useState } from 'react'

export const useDebouncedValue = <TValue,>(
  value: TValue,
  delayInMs: number
) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delayInMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [delayInMs, value])

  return debouncedValue
}
