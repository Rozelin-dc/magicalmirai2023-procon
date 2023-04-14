import { useRef } from 'react'
import { IChar, Player } from 'textalive-app-api'

export const useLyrics = () => {
  const lastChar = useRef<IChar | null>(null)

  const setLyrics = (
    position: number,
    player: Player,
    ref: HTMLDivElement | null
  ) => {
    if (
      (lastChar.current &&
        lastChar.current.parent.parent.lastChar === lastChar.current &&
        lastChar.current.endTime < position - 2000) ||
      player.video.endTime <= position
    ) {
      // フレーズの最後の歌詞から2秒以上経過したか曲が終わった
      resetNode(ref)
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
      resetNode(ref)
    }

    if (nowChar.previous && nowChar.previous.text === '「') {
      // 前の歌詞が'「'の場合、改行されるようにdivを入れる
      const div = document.createElement('div')
      div.style.width = '100%'
      ref?.appendChild(div)
      // '「'も入れないと表示されない
      const span = document.createElement('span')
      span.appendChild(document.createTextNode('「'))
      ref?.appendChild(span)
    }

    lastChar.current = nowChar
    const span = document.createElement('span')
    span.appendChild(document.createTextNode(nowChar.text))
    ref?.appendChild(span)
  }

  return { setLyrics }
}

const resetNode = (ref: HTMLDivElement | null) => {
  if (!ref) {
    return
  }
  while (ref.firstChild) {
    ref.removeChild(ref.firstChild)
  }
}
