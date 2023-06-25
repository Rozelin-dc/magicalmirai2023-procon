import { useEffect, useState, useMemo, useCallback } from 'react'
import { IPlayerApp, Player, PlayerListener } from 'textalive-app-api'
import { Toaster, toast } from 'react-hot-toast'

import { SongName, songData } from './utils/songData'
import { RomanType, getRomanSetting, setRomanSetting } from './utils/roman'
import logo from './assets/logo.svg'
import IndividualScore from './IndividualScore'
import Game from './Game'
import SongSelect from './SongSelect'
import Loading from './components/Loading'
import RightButtons from './RightButtons'
import './app.scss'

export default function App() {
  const [player, setPlayer] = useState<Player>()
  const [app, setApp] = useState<IPlayerApp>()

  const [songName, setSongName] = useState<SongName | ''>('')
  const [romanType, setRomanType] = useState<RomanType>(
    getRomanSetting() ?? 'ヘボン式'
  )
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isTimerReady, setIsTimerReady] = useState(false)
  const [position, setPosition] = useState(-1)

  const [showIndividualScore, setShowIndividualScore] = useState(false)

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

  const handleChangeRomanType = useCallback((romanType: RomanType) => {
    setRomanType(romanType)
    setRomanSetting(romanType)
  }, [])

  const handleSongSelect = useCallback(
    async (songName: SongName) => {
      if (!player) {
        return
      }
      setSongName(songName)

      try {
        await player.createFromSongUrl(
          songData[songName].songUrl,
          songData[songName].songUrlOptions
        )
      } catch (e) {
        toast.error('楽曲情報の読み込みに失敗しました')
        console.log(JSON.stringify(e))
        setSongName('')
      }
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
    setPosition(-1)
  }, [player])

  const resetSong = useCallback(() => {
    setIsVideoReady(false)
    setIsTimerReady(false)
    setSongName('')
  }, [])

  return (
    <div className='app'>
      <img src={logo} className='logo' />
      {!player ? (
        <Loading />
      ) : showIndividualScore ? (
        <IndividualScore onBack={() => setShowIndividualScore(false)} />
      ) : songName === '' ? (
        <SongSelect onSelect={handleSongSelect} />
      ) : (
        <Game
          songName={songName}
          player={player}
          position={position}
          romanType={romanType}
          onPlay={handlePlay}
          onStop={handleStop}
          onBack={resetSong}
          isVideoReady={isVideoReady}
          isTimerReady={isTimerReady}
        />
      )}
      {player && (
        <RightButtons
          romanType={romanType}
          onChangeRomanType={handleChangeRomanType}
          isSongSelectPage={!showIndividualScore && songName === ''}
          toIndividualScorePage={() => setShowIndividualScore(true)}
        />
      )}
      {media}
      <Toaster
        position='top-center'
        reverseOrder={false}
        gutter={5}
        toastOptions={{
          icon: '',
          duration: 3000,
          style: {
            fontSize: '20px',
            color: '#ffffff',
            background: '#006477',
            borderRadius: 0,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#00fff9',
            padding: '10px 0',
          },
          error: {
            style: {
              backgroundColor: '#a32600',
              borderColor: '#ff8f8f',
            },
          },
        }}
      />
    </div>
  )
}
