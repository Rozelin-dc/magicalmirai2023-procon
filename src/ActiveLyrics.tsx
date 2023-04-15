import { useEffect, useRef } from 'react'
import { IChar } from 'textalive-app-api'
import { VideoCanvasProps } from './type'
import { resetNode } from './utils/resetNode'
import { useWindow } from './hooks/window'
import './active-lyrics.css'

export default function ActiveLyrics({ position, player }: VideoCanvasProps) {
  const { isVertical } = useWindow()
  const ref = useRef<HTMLDivElement | null>(null)
  const lastChar = useRef<IChar | null>(null)

  useEffect(() => {
    if (!player || !player.video || !ref.current) {
      return
    }

    if (
      (lastChar.current &&
        lastChar.current.parent.parent.lastChar === lastChar.current &&
        lastChar.current.endTime < position - 1000) ||
      player.video.endTime <= position
    ) {
      // フレーズの最後の歌詞からある程度経過したか曲が終わった
      resetNode(ref.current)
      lastChar.current = null
    }

    const nowChar = player.video.findChar(position + 500)
    if (!nowChar) {
      // 歌詞が無い場合
      return
    }

    if (nowChar === lastChar.current) {
      // 歌詞の変化が無い場合
      return
    }

    if (nowChar.parent.parent.firstChar === nowChar) {
      // 新しいフレーズがはじまった
      resetNode(ref.current)
    }

    if (nowChar.previous && nowChar.previous.text === '「') {
      // 前の歌詞が'「'の場合、フレーズが切り替わったとみなす
      resetNode(ref.current)

      // '「'も入れないと表示されない
      const span = document.createElement('span')
      span.appendChild(document.createTextNode('「'))
      ref.current.appendChild(span)
    }

    lastChar.current = nowChar
    const span = document.createElement('span')
    span.appendChild(document.createTextNode(nowChar.text))
    if (nowChar.parent.pos === 'N') {
      // 名詞の一部なら色を変える
      span.style.color = '#38FF00'
    }
    ref.current.appendChild(span)
  }, [position, player])

  return (
    <div
      className={`active-lyrics${isVertical ? ' vertical' : ''}`}
      ref={ref}
    />
  )
}
