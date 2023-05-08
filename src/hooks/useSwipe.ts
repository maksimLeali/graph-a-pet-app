import { useCallback, useState } from 'react'

type Params = {
  onLeft?: () => void
  onRight?: () => void
  threshold?: number
}

export const useSwipe = ({ onLeft, onRight, threshold = 30 }: Params) => {
  const [xDown, setXDown] = useState<number | null>(null)
  const [yDown, setYDown] = useState<number | null>(null)

  const handleTouchStart = useCallback((evt: any) => {
    const firstTouch = evt.touches[0]
    setXDown(firstTouch.clientX)
    setYDown(firstTouch.clientY)
  }, [])

  const handleTouchMove = useCallback(
    (evt: any) => {
      if (!xDown || !yDown) {
        return
      }

      const xDiff = xDown - evt.touches[0].clientX
      const yDiff = yDown - evt.touches[0].clientY

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > threshold) {
          onLeft && onLeft()
          setXDown(null)
          setYDown(null)
        } else if (xDiff < -threshold) {
          onRight && onRight()
          setXDown(null)
          setYDown(null)
        }
      }
    },
    [onLeft, onRight, threshold, xDown, yDown]
  )

  return { handleTouchStart, handleTouchMove }
}
