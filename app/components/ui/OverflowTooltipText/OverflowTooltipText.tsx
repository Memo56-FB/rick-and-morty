'use client'

import { type RefObject, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './OverflowTooltipText.module.css'

type OverflowTooltipTextProps = {
  text: string
  as?: 'span' | 'p' | 'h2'
  className: string
  wrapperClassName?: string
  tooltipClassName?: string
}

export const OverflowTooltipText = ({
  text,
  as = 'span',
  className,
  wrapperClassName = '',
  tooltipClassName = '',
}: OverflowTooltipTextProps) => {
  const textRef = useRef<HTMLElement | null>(null)
  const tooltipId = useId()
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const element = textRef.current

    if (!element) {
      return
    }

    const checkOverflow = () => {
      setIsOverflowing(
        element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight
      )
    }

    checkOverflow()

    const resizeObserver = new ResizeObserver(checkOverflow)
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [text])

  useEffect(() => {
    if (!isTooltipOpen) {
      return
    }

    const updateTooltipPosition = () => {
      const element = textRef.current

      if (!element) {
        return
      }

      const rect = element.getBoundingClientRect()
      setTooltipPosition({
        top: Math.max(rect.top - 10, 8),
        left: rect.left + rect.width / 2,
      })
    }

    updateTooltipPosition()

    window.addEventListener('resize', updateTooltipPosition)
    window.addEventListener('scroll', updateTooltipPosition, true)

    return () => {
      window.removeEventListener('resize', updateTooltipPosition)
      window.removeEventListener('scroll', updateTooltipPosition, true)
    }
  }, [isTooltipOpen])

  const shouldShowTooltip = isOverflowing && isTooltipOpen

  const openTooltip = () => {
    if (isOverflowing) {
      setIsTooltipOpen(true)
    }
  }

  const closeTooltip = () => {
    setIsTooltipOpen(false)
  }

  const renderTextNode = () => {
    if (as === 'h2') {
      return (
        <h2 ref={textRef as RefObject<HTMLHeadingElement>} className={className}>
          {text}
        </h2>
      )
    }

    if (as === 'p') {
      return (
        <p ref={textRef as RefObject<HTMLParagraphElement>} className={className}>
          {text}
        </p>
      )
    }

    return (
      <span ref={textRef as RefObject<HTMLSpanElement>} className={className}>
        {text}
      </span>
    )
  }

  return (
    <span
      className={`${styles.trigger} ${wrapperClassName}`.trim()}
      tabIndex={isOverflowing ? 0 : -1}
      aria-describedby={isOverflowing ? tooltipId : undefined}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onFocus={openTooltip}
      onBlur={closeTooltip}
    >
      {renderTextNode()}

      {shouldShowTooltip && typeof document !== 'undefined'
        ? createPortal(
            <span
              id={tooltipId}
              role='tooltip'
              className={`${styles.bubble} ${tooltipClassName}`.trim()}
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
              }}
            >
              {text}
            </span>,
            document.body
          )
        : null}
    </span>
  )
}
