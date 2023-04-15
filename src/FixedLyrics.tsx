import { useEffect, useRef } from 'react'
import { useWindow } from './hooks/window'
import { useCoordinate } from './hooks/coordinate'
import { coordinateIdx } from './utils/coordinate'
import { VideoCanvasProps } from './type'
import './fixed-lyrics.css'
import { IPhrase } from 'textalive-app-api'
import { resetNode } from './utils/resetNode'

export default function FixedLyrics({ player, position }: VideoCanvasProps) {
  const { isVertical, windowSize } = useWindow()
  const { dotSize, coordinate } = useCoordinate(
    windowSize.width,
    windowSize.height,
    isVertical
  )

  const ref = useRef<HTMLDivElement | null>(null)
  const nowPhrase = useRef<IPhrase | null>(null)
  const nowIndex = useRef(0)

  useEffect(() => {
    if (!player || !player.video || !ref.current) {
      return
    }

    const phrase = player.video.findPhrase(position)

    if (nowPhrase.current && phrase !== nowPhrase.current) {
      // フレーズが切り替わった
      nowPhrase.current.text.split('').forEach(v => {
        const co =
          coordinate[
            nowIndex.current < coordinateIdx.length
              ? coordinateIdx[nowIndex.current]
              : coordinateIdx[nowIndex.current - coordinateIdx.length]
          ]

        const span = document.createElement('span')
        span.appendChild(document.createTextNode(v))
        span.style.fontSize = `${dotSize}px`
        span.style.top = `${co.y}px`
        span.style.left = `${co.x}px`
        ref.current?.appendChild(span)

        nowIndex.current += 1
      })
    }
    nowPhrase.current = phrase
  }, [position, player])

  useEffect(() => {
    // 画面サイズの変更があったら配置し直す
    if (!player || !player.video || !ref.current) {
      return
    }

    resetNode(ref.current)

    let p = player.video.firstPhrase
    let i = 0
    while (p && p.endTime < position) {
      p.text.split('').forEach(v => {
        const co =
          coordinate[
            i < coordinateIdx.length
              ? coordinateIdx[i]
              : coordinateIdx[i - coordinateIdx.length]
          ]

        const span = document.createElement('span')
        span.appendChild(document.createTextNode(v))
        span.style.fontSize = `${dotSize}px`
        span.style.top = `${co.y}px`
        span.style.left = `${co.x}px`
        ref.current?.appendChild(span)
        i += 1
      })
      p = p.next
    }
  }, [windowSize])

  return (
    <div ref={ref} className='fixed-lyrics' />
  )
}
