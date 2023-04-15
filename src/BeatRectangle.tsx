import { useEffect, useRef } from 'react'
import { IBeat } from 'textalive-app-api'
import { VideoCanvasProps } from './type'
import './beat-rectangle.css'

export default function BeatRectangle({ position, player }: VideoCanvasProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const nowBeat = useRef<IBeat | null>(null)

  useEffect(() => {
    if (!player || !ref.current) {
      return
    }

    const beat = player.findBeat(position)
    if (beat && beat !== nowBeat.current) {
      // 新しいビートがはじまった
      const deg = (position / 50) % 360
      const span = document.createElement('span')
      span.className = 'rectangle'
      span.style.transform = `translateX(-50%) translateY(-50%) rotate(${deg}deg)`
      span.style.borderColor = `hsl(${deg}, 92%, 67%)`
      ref.current.appendChild(span)
    }
    nowBeat.current = beat
  }, [position, player])

  return <div ref={ref} className='background' />
}
