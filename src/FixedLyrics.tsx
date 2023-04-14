import { useMemo } from 'react'
import { Player } from 'textalive-app-api'
import { useWindow } from './hooks/window'
import { useCoordinate } from './hooks/coordinate'
import { coordinateIdx } from './utils/coordinate'
import './style.css'

interface Props {
  player?: Player
  position: number
}

export default function FixedLyrics({ player, position }: Props) {
  const { isVertical, windowSize } = useWindow()
  const { dotSize, coordinate } = useCoordinate(
    windowSize.width,
    windowSize.height,
    isVertical
  )

  const lyrics = useMemo(() => {
    if (!player || !player.video) {
      return ''
    }

    let l = ''
    let p = player.video.firstPhrase
    while (p && p.endTime < position) {
      l += p.text
      p = p.next
    }
    return l
  }, [position, player])

  if (!player) {
    return null
  }

  return (
    <div className='fixed-lyrics'>
      {lyrics.split('').map((v, i) => {
        const co =
          coordinate[
            i < coordinateIdx.length
              ? coordinateIdx[i]
              : coordinateIdx[i - coordinateIdx.length]
          ]
        return (
          <span
            key={i}
            style={{
              fontSize: dotSize,
              top: co.x,
              left: co.y,
            }}
          >
            {v}
          </span>
        )
      })}
    </div>
  )
}
