import { useCallback, useEffect, useMemo, useState } from 'react'
import { MdPlayCircleOutline, MdRestartAlt, MdShare } from 'react-icons/md'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Player } from 'textalive-app-api'
import { toast } from 'react-hot-toast'

import { SongName, songData } from '../utils/songData'
import { RomanType, kanaToRoman } from '../utils/roman'
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
  onPlay(): boolean
  onStop(): boolean
  onBack(): void

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
  onBack,
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
  }, [lyricsReadingRoman])
  const scoreRatio = useMemo(() => {
    if (maxScore === 0) {
      return 0
    }
    return score / maxScore
  }, [score, maxScore])

  const [started, setStarted] = useState(false)
  const isFinish = useMemo(
    () =>
      started
        ? position >= player.getBeats().splice(-1)[0].endTime &&
          position >= player.video.lastPhrase.endTime // ビートが無くなっても歌唱時間は終わっていない曲があるので
        : false,
    [player, position, started]
  )
  const isHighScore = useMemo(
    () => isFinish && score > highScore,
    [highScore, isFinish, score]
  )

  useEffect(() => {
    // ハイスコア更新時の処理
    if (isHighScore) {
      setHighScore(songName, score)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHighScore])

  useEffect(() => {
    // 楽曲が変わった際の初期化
    setScore(0)
    setStarted(false)
  }, [songName])

  const handlePlay = useCallback(() => {
    const res = onPlay()
    if (!res) {
      toast.error('楽曲の再生に失敗しました')
      return
    }

    setStarted(true)
  }, [onPlay])

  const handleRestart = useCallback(() => {
    const res = onStop()
    if (!res) {
      toast.error('楽曲の停止に失敗しました')
      return
    }

    setScore(0)
    setStarted(false)
  }, [onStop])

  const handleBack = useCallback(() => {
    const res = onStop()
    if (!res) {
      toast.error('楽曲の停止に失敗しました')
      return
    }

    onBack()
  }, [onBack, onStop])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) {
        // キーが押しっぱなしになっている
        return
      }

      if (isVideoReady && isTimerReady && !player.isPlaying && !started) {
        // 再生待機状態でエンターまたはスペースが押されたら再生
        if (e.key === 'Enter' || e.key === ' ') {
          handlePlay()
        }
        return
      }
    },
    [isVideoReady, isTimerReady, started, player, handlePlay]
  )

  const copyShareText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `${romanType}ローマ字で『${songName}』に挑戦し、${score}点獲得しました！\n#TypingLyrics\n${window.location.href}`
      )
      toast('シェア用テキストをクリップボードにコピーしました')
    } catch (e) {
      toast.error('シェア用テキストのコピーに失敗しました')
      console.log(JSON.stringify(e))
    }
  }, [romanType, score, songName])

  useEffect(() => {
    // キー入力に反応するように
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!isVideoReady || !isTimerReady) {
    return <Loading />
  }

  if (!player.isPlaying && !started) {
    return (
      <div className='play-waiting-area'>
        <button className='play-button' onClick={handlePlay}>
          <MdPlayCircleOutline />
        </button>
        <div className='description'>{'Press Enter or Space'}</div>
      </div>
    )
  }

  return (
    <div className='game-container'>
      <button className='icon-button stop-button' onClick={handleBack}>
        <RiArrowGoBackFill />
      </button>
      {isFinish ? (
        <div className='game-finish-area'>
          <CharacterFinish
            songName={songName}
            isSuccess={scoreRatio >= songData[songName].successRatio}
          />
          <div className='result-text'>
            {scoreRatio >= songData[songName].successRatio
              ? 'SUCCESS!'
              : 'FAIL...'}
          </div>
          <div className='finish-button-area'>
            <button className='icon-button' onClick={handleRestart}>
              <MdRestartAlt />
            </button>
            <button className='icon-button' onClick={copyShareText}>
              <MdShare />
            </button>
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
        <div className='song-name'>{`♪${songName}`}</div>
        <div className='score-container'>
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
