import { useEffect, useState, useMemo } from 'react'
import { IPlayerApp, Player, PlayerListener } from 'textalive-app-api'
import { MdPlayCircleOutline } from 'react-icons/md'
import { FiLoader } from 'react-icons/fi'
import './style.css'
import FixedLyrics from './FixedLyrics'
import ActiveLyrics from './ActiveLyrics'
import BeatRectangle from './BeatRectangle'
import { useWindow } from './hooks/window'

export default function App() {
  const [player, setPlayer] = useState<Player>()
  const [app, setApp] = useState<IPlayerApp>()
  const { isVertical } = useWindow()
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
          // 唱明者 / すこやか大聖堂 feat. KAITO
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
    }
  }, [mediaElement])

  return (
    <div className='app'>
      {player && app && isReady ? (
        <button
          onClick={() => player.requestPlay()}
          className={`play-button${isPlayed ? ' not-show' : ''}`}
        >
          <MdPlayCircleOutline />
        </button>
      ) : (
        <FiLoader className='loading' />
      )}
      <ActiveLyrics player={player} position={position} />
      <FixedLyrics player={player} position={position} />
      <BeatRectangle player={player} position={position} />
      {/* 「青く」の歌詞で背景を青くする */}
      <div className={position > 108676 ? 'blue-bg' : ''} />
      {/* 最後の歌詞が発声されたら背景を白くする */}
      <div
        className={
          player && player.video && player.video.lastChar.startTime < position
            ? 'white-bg'
            : ''
        }
      />
      {/* 最後のビートが終わったらタイトルを表示 */}
      <div
        className={`title${isVertical ? ' vertical' : ''}${
          player &&
          player.getBeats() &&
          player.getBeats().length > 0 &&
          player.getBeats().splice(-1)[0].endTime < position
            ? ' show'
            : ''
        }`}
      >
        {player && player.data && player.data.song ? player.data.song.name : ''}
      </div>
      {media}
    </div>
  )
}
