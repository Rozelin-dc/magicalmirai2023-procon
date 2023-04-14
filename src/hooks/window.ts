import { useLayoutEffect, useState } from 'react'

export const useWindow = () => {
  const [isVertical, setIsVertical] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setIsVertical(window.innerHeight > window.innerWidth)
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return { isVertical, windowSize }
}
