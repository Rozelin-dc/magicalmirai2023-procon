import { useEffect, useState, useMemo, useCallback } from 'react'
import { IPlayerApp, Player, PlayerListener } from 'textalive-app-api'

import { SongName, songData } from './utils/songData'
import logo from './assets/logo.svg'
import Game from './Game'
import SongSelect from './SongSelect'
import Loading from './components/Loading'
import './app.scss'

export default function App() {
  const [player, setPlayer] = useState<Player>()
  const [app, setApp] = useState<IPlayerApp>()
  const [songName, setSongName] = useState<SongName | ''>('')
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isTimerReady, setIsTimerReady] = useState(false)
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
        setApp(app)
      },
      onVideoReady: () => {
        setIsVideoReady(true)
      },
      onTimerReady: () => {
        setIsTimerReady(true)
      },
      onTimeUpdate: (position) => {
        setPosition(position)
      },
    }
    p.addListener(playerListener)

    setPlayer(p)

    return () => {
      p.removeListener(playerListener)
      p.dispose()
    }
  }, [mediaElement])

  const handleSongSelect = useCallback(
    (songName: SongName) => {
      if (!player) {
        return
      }

      player.createFromSongUrl(
        songData[songName].songUrl,
        songData[songName].songUrlOptions
      )
      setSongName(songName)
    },
    [player]
  )

  const handlePlay = useCallback(() => {
    if (!player) {
      return
    }

    player.requestPlay()
  }, [player])

  const handleStop = useCallback(() => {
    if (!player) {
      return
    }

    player.requestStop()
    setIsVideoReady(false)
    setIsTimerReady(false)
    setSongName('')
    setPosition(-1)
  }, [player])

  return (
    <div className='app'>
      <img src={logo} className='logo' />
      {!player ? (
        <Loading />
      ) : songName === '' ? (
        <SongSelect onSelect={handleSongSelect} />
      ) : (
        <Game
          songName={songName}
          player={player}
          position={position}
          onPlay={handlePlay}
          onStop={handleStop}
          isVideoReady={isVideoReady}
          isTimerReady={isTimerReady}
        />
      )}
      {media}
    </div>
  )
}
