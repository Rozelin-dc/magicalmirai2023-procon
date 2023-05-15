import { useCallback, useEffect, useMemo, useState } from 'react'
import { MdPlayCircleOutline } from 'react-icons/md'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Player } from 'textalive-app-api'

import { SongName, songData } from '../utils/songData'
import { RomanType, kanaToRoman } from '../utils/toRoman'
import { getHighScore, setHighScore } from '../utils/individualScore'
import Loading from '../components/Loading'

import CharacterFinish from './CharacterFinish'
import GamePlaying from './GamePlaying'
import './index.scss'

interface Props {
  songName: SongName
  player: Player
  position: number
  romanType: RomanType
  onPlay(): void
  onStop(): void

  isVideoReady: boolean
  isTimerReady: boolean
}

export default function Game({
  songName,
  player,
  position,
  romanType,
  onPlay,
  onStop,
  isVideoReady,
  isTimerReady,
}: Props) {
  const lyricsReadingRoman = useMemo(
    () =>
      songData[songName].lyricsReading.map((v) => kanaToRoman(v, romanType)),
    [songName, romanType]
  )
  const highScore = useMemo(() => getHighScore(songName) ?? -1, [songName])

  const [score, setScore] = useState(0)
  const maxScore = useMemo(() => {
    let sum = 0
    lyricsReadingRoman.forEach((v) => (sum += v.replaceAll(' ', '').length))
    return sum
  }, [songName, lyricsReadingRoman])
  const scoreRatio = useMemo(() => {
    if (maxScore === 0) {
      return 0
    }
    return score / maxScore
  }, [score, maxScore])

  const isFinish = useMemo(
    () =>
      player.getBeats()
        ? position >= player.getBeats().splice(-1)[0].endTime
        : false,
    [position]
  )
  const isHighScore = useMemo(
    () => isFinish && score > highScore,
    [isFinish, score]
  )

  useEffect(() => {
    // ハイスコア更新時の処理
    if (isHighScore) {
      setHighScore(songName, score)
    }
  }, [isHighScore])

  useEffect(() => {
    // 楽曲が変わった際の初期化
    setScore(0)
  }, [songName])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) {
        // キーが押しっぱなしになっている
        return
      }

      if (isVideoReady && isTimerReady && !player.isPlaying) {
        // 再生待機状態でエンターまたはスペースが押されたら再生
        if (e.key === 'Enter' || e.key === ' ') {
          onPlay()
        }
        return
      }
    },
    [isVideoReady, isTimerReady, player]
  )

  useEffect(() => {
    // キー入力に反応するように
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isVideoReady || !isTimerReady) {
    return <Loading />
  }

  if (!player.isPlaying) {
    return (
      <div className='play-waiting-area'>
        <MdPlayCircleOutline className='play-button' onClick={onPlay} />
        <div className='description'>{'Press Enter or Space'}</div>
      </div>
    )
  }

  return (
    <div className='game-container'>
      <button className='stop-button' onClick={onStop}>
        <RiArrowGoBackFill />
      </button>
      {isFinish ? (
        <div className='game-finish-area'>
          <CharacterFinish songName={songName} isSuccess={scoreRatio >= 0.8} />
          <div className='result-text'>
            {scoreRatio >= 0.8 ? 'SUCCESS!' : 'FAIL...'}
          </div>
        </div>
      ) : (
        <GamePlaying
          player={player}
          position={position}
          songName={songName}
          lyricsReadingRoman={lyricsReadingRoman}
          onSuccess={() => setScore((prev) => prev + 1)}
        />
      )}
      <div className='score-area'>
        <div>
          <div className='score-title'>{'Score'}</div>
          <div className='score-content'>{`${score} / ${maxScore}`}</div>
        </div>
        {isHighScore && (
          <div className='update-high-score'>{'High Score!'}</div>
        )}
      </div>
    </div>
  )
}
