import { useMemo } from 'react'
import { PX_SIZE, sho, mei, sha } from '../utils/coordinate'

export const useCoordinate = (
  width: number,
  height: number,
  isVertical: boolean
) => {
  // 1文字あたりの文字サイズ
  const [blockSize, beginCoordinate] = useMemo(() => {
    if (isVertical) {
      if (width - 20 * 2 < (height - (20 * 2 + 10 * 2)) / 3) {
        const size = width - 20 * 2
        return [size, { x: 20, y: (height - size * 3) / 2 }]
      } else {
        const size = (height - (20 * 2 + 10 * 2)) / 3
        return [size, { x: (width - size) / 2, y: size }]
      }
    }
    if (height - 20 * 2 < (width - (20 * 2 + 10 * 2)) / 3) {
      const size = height - 20 * 2
      return [size, { x: (width - size * 3) / 2, y: size }]
    }

    const size = (width - (20 * 2 + 10 * 2)) / 3
    return [size, { x: 20, y: (height - size) / 2 }]
  }, [width, height, isVertical])

  // ドットのサイズ
  const dotSize = useMemo(() => blockSize / PX_SIZE, [blockSize])

  const coordinate = useMemo(
    () =>
      isVertical
        ? sho
            .map((v) => ({
              x: v[0] * dotSize + beginCoordinate.x,
              y: v[1] * dotSize + beginCoordinate.y,
            }))
            .concat(
              mei.map((v) => ({
                x: v[0] * dotSize + beginCoordinate.x,
                y: v[1] * dotSize + beginCoordinate.y + blockSize + 10,
              }))
            )
            .concat(
              sha.map((v) => ({
                x: v[0] * dotSize + beginCoordinate.x,
                y: v[1] * dotSize + beginCoordinate.y + blockSize + 20,
              }))
            )
        : sho
            .map((v) => ({
              x: v[0] * dotSize + beginCoordinate.x,
              y: v[1] * dotSize + beginCoordinate.y,
            }))
            .concat(
              mei.map((v) => ({
                x: v[0] * dotSize + beginCoordinate.x + blockSize + 10,
                y: v[1] * dotSize + beginCoordinate.y,
              }))
            )
            .concat(
              sha.map((v) => ({
                x: v[0] * dotSize + beginCoordinate.x + blockSize + 20,
                y: v[1] * dotSize + beginCoordinate.y,
              }))
            ),
    [isVertical, dotSize, blockSize, beginCoordinate]
  )

  return { dotSize, coordinate }
}
