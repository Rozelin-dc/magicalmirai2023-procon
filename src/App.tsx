import { useEffect, useState, useMemo, useRef } from 'react'
import { IChar, IPlayerApp, Player, PlayerListener } from 'textalive-app-api'
import { MdPlayCircleOutline } from 'react-icons/md'
import './style.css'

export default function App() {
  const [player, setPlayer] = useState<Player>()
  const [app, setApp] = useState<IPlayerApp>()
  const [isReady, setIsReady] = useState(false)
  const [isPlayed, setIsPlayed] = useState(false)
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null)
  const activeLyricsRef = useRef<HTMLDivElement | null>(null)
  const lastChar = useRef<IChar | null>(null)

  const media = useMemo(
    () => <div className='media' ref={setMediaElement} />,
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !mediaElement) {
      return
    }

    console.log('--- [app] create Player instance ---')
    const p = new Player({
      app: {
        // トークンは https://developer.textalive.jp/profile で取得したものを使う
        token: 'T1eQwHaxqMeDptHe',
      },
      mediaElement,
    })

    const playerListener: PlayerListener = {
      onAppReady: (app) => {
        console.log('--- [app] initialized as TextAlive app ---')
        console.log('managed:', app.managed)
        console.log('host:', app.host)
        console.log('song url:', app.songUrl)
        if (!app.songUrl) {
          p.createFromSongUrl('https://piapro.jp/t/Vfrl/20230120182855', {
            video: {
              // 音楽地図訂正履歴: https://songle.jp/songs/2427950/history
              beatId: 4267334,
              chordId: 2405059,
              repetitiveSegmentId: 2475645,
              // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FVfrl%2F20230120182855
              lyricId: 56095,
              lyricDiffId: 9637,
            },
          })
        }
        setApp(app)
      },
      onVideoReady: () => {
        console.log('--- [app] video is ready ---')
        console.log('player:', p)
        console.log('player.data.song:', p.data.song)
        console.log('player.data.song.name:', p.data.song.name)
        console.log('player.data.song.artist.name:', p.data.song.artist.name)
        console.log('player.data.songMap:', p.data.songMap)
        setIsReady(true)
      },
      onTimeUpdate: (position) => {
        if (
          lastChar.current &&
          lastChar.current.parent.parent.lastChar === lastChar.current &&
          lastChar.current.endTime < position - 3000
        ) {
          // フレーズの最後の歌詞から3秒以上経過
          console.log('hoge')
          resetNode(activeLyricsRef.current)
          lastChar.current = null
        }

        const nowChar = p.video.findChar(position + 500)
        if (!nowChar) {
          // 歌詞が無い場合
          lastChar.current = null
          return
        }

        if (nowChar === lastChar.current) {
          // 歌詞の変化が無い場合
          return
        }

        if (nowChar.parent.parent.firstChar === nowChar) {
          // 新しいフレーズがはじまった
          console.log('ふが')
          resetNode(activeLyricsRef.current)
        }

        console.log(
          `now: ${nowChar.text}, last${
            lastChar.current ? lastChar.current.text : 'null'
          }`
        )

        lastChar.current = nowChar
        const span = document.createElement('span')
        span.appendChild(document.createTextNode(nowChar.text))
        activeLyricsRef.current?.appendChild(span)
      },
      onPlay: () => setIsPlayed(true),
    }
    p.addListener(playerListener)

    setPlayer(p)

    return () => {
      console.log('--- [app] shutdown ---')
      p.removeListener(playerListener)
      p.dispose()
    }
  }, [mediaElement])

  return (
    <div className='app'>
      {!isPlayed && player && isReady && (
        <button onClick={() => player.requestPlay()} className='play-button'>
          <MdPlayCircleOutline />
        </button>
      )}
      <div className='active-lyrics' ref={activeLyricsRef} />
      {media}
    </div>
  )
}

const resetNode = (ref: HTMLDivElement | null) => {
  if (!ref) {
    return
  }
  while (ref.firstChild) {
    ref.removeChild(ref.firstChild)
  }
}
