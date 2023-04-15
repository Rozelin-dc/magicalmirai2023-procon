import { useEffect, useState, useMemo } from 'react'
import { IPlayerApp, Player, PlayerListener } from 'textalive-app-api'
import { MdPlayCircleOutline } from 'react-icons/md'
import './style.css'
import FixedLyrics from './FixedLyrics'
import ActiveLyrics from './ActiveLyrics'
import Background from './Background'

export default function App() {
  const [player, setPlayer] = useState<Player>()
  const [app, setApp] = useState<IPlayerApp>()
  const [isReady, setIsReady] = useState(false)
  const [isPlayed, setIsPlayed] = useState(false)
  const [position, setPosition] = useState(0)
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
              lyricDiffId: 9651,
            },
          })
        }
        setApp(app)
      },
      onVideoReady: () => {
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
      {player && app && isReady && (
        <button
          onClick={() => player.requestPlay()}
          className={`play-button${isPlayed ? ' not-show' : ''}`}
        >
          <MdPlayCircleOutline />
        </button>
      )}
      <ActiveLyrics player={player} position={position} />
      <FixedLyrics player={player} position={position} />
      <Background player={player} position={position} />
      {media}
    </div>
  )
}
