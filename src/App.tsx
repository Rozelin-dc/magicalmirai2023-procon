import React, { useEffect, useState, useMemo, useRef } from 'react'
import { IPlayerApp, Player, PlayerListener } from 'textalive-app-api'
import { MdPlayCircleOutline } from 'react-icons/md'
import './style.css'

export default function App() {
  const [player, setPlayer] = useState<Player>()
  const [app, setApp] = useState<IPlayerApp>()
  const [isPlayed, setIsPlayed] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [position, setPosition] = useState(-1)
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null)

  const media = useMemo(
    () => <div className='media' ref={setMediaElement} />,
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !mediaElement) {
      return
    }

    const p = new Player({
      app: {
        // トークンは https://developer.textalive.jp/profile で取得したものを使う
        token: 'T1eQwHaxqMeDptHe',
      },
      mediaElement,
    })

    const playerListener: PlayerListener = {
      onAppReady: (app) => {
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
      onTimerReady: () => {
        setIsReady(true)
      },
      onTimeUpdate: (position) => {
        setPosition(position)
      },
      onPlay: () => setIsPlayed(true),
    }
    p.addListener(playerListener)

    setPlayer(p)

    return () => {
      p.removeListener(playerListener)
      p.dispose()
    }
  }, [mediaElement])

  return (
    <div className='app'>
      {!isPlayed && player && (
        <button onClick={() => player.requestPlay()} className='play-button'>
          <MdPlayCircleOutline />
        </button>
      )}
      <div className='wrapper'>
        <div className='char'>{char}</div>
      </div>
      {media}
    </div>
  )
}
