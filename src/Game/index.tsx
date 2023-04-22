import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MdPlayCircleOutline } from 'react-icons/md'
import { FiLoader } from 'react-icons/fi'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { IPhrase, Player } from 'textalive-app-api'
import { SongName, songData } from '../utils/songData'
import CharacterPlaying from './CharacterPlaying'
import TimerBar from './TimerBar'
import '../index.css'
import './index.css'
import CharacterFinish from './CharacterFinish'

interface Props {
  songName: SongName | ''
  player?: Player
  position: number
  onPlay(): void
  onStop(): void

  isVideoReady: boolean
  isTimerReady: boolean
}

export default function Game({
  songName,
  player,
  position,
  onPlay,
  onStop,
  isVideoReady,
  isTimerReady,
}: Props) {
  const songLyrics = useMemo(() => {
    if (songName === '') {
      return []
    }

    return songData[songName].lyricReading
  }, [songName])
  const [nowPhrase, setNowPhrase] = useState<IPhrase>()
  const [nextPhrase, setNextPhrase] = useState<IPhrase>()
  const [nowPhraseReading, setNowPhraseReading] = useState('')
  // nowPhrase が歌詞中の何番目のフレーズか
  const nowPhraseIndex = useRef(-1)

  // nowPhraseReading の何文字目までタイプできたか
  const [passedLastCharacterIndex, setPassedLastCharacterIndex] = useState(-1)

  const [score, setScore] = useState(0)
  const maxScore = useMemo(() => {
    if (songName === '') {
      return 0
    }
    let sum = 0
    songData[songName].lyricReading.forEach(
      (v) => (sum += v.replaceAll(' ', '').length)
    )
    return sum
  }, [songName])
  const scoreRatio = useMemo(() => {
    if (maxScore === 0) {
      return 0
    }
    return score / maxScore
  }, [score, maxScore])

  const [isFail, setIsFail] = useState(false)

  useEffect(() => {
    // 再生中の処理
    if (nowPhrase && nowPhrase.endTime < position) {
      // フレーズの歌唱時間が終わった
      setNowPhrase(undefined)
      setNowPhraseReading('')
    }
    if (nextPhrase && nextPhrase.startTime <= position) {
      // 次のフレーズの歌唱時間がはじまろうとしている
      nowPhraseIndex.current += 1
      setNowPhraseReading(songLyrics[nowPhraseIndex.current])
      setNowPhrase(nextPhrase)
      setNextPhrase(nextPhrase.next)
      setPassedLastCharacterIndex(-1)
    }
  }, [position])

  useEffect(() => {
    // ビデオの読み込みが完了した時の初期化
    if (isVideoReady) {
      setNextPhrase(player?.video.firstPhrase)
    }
  }, [isVideoReady])

  useEffect(() => {
    // 楽曲が変わった際の初期化
    setPassedLastCharacterIndex(-1)
    nowPhraseIndex.current = -1
    setNowPhraseReading('')
    setNowPhrase(undefined)
    setScore(0)
  }, [songName])

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (passedLastCharacterIndex + 1 >= nowPhraseReading.length) {
        // 既に全て打ちきっているか、歌唱中ではない
        return
      }

      if (
        e.key.toUpperCase() ===
        nowPhraseReading.charAt(passedLastCharacterIndex + 1)
      ) {
        // 正しくタイプした
        setPassedLastCharacterIndex((prev) => {
          if (
            prev + 2 < nowPhraseReading.length &&
            nowPhraseReading.charAt(prev + 2) === ' '
          ) {
            // 次の文字がスペースならインデックスを2送る
            return prev + 2
          }
          return prev + 1
        })
        // スコアの加算
        setScore((prev) => prev + 1)
      } else {
        // ミスタイプした
        setIsFail(true)
      }
    },
    [nowPhraseReading, passedLastCharacterIndex]
  )

  useEffect(() => {
    // キー入力に反応するように
    document.addEventListener('keypress', handleKeyPress)
    return () => document.removeEventListener('keypress', handleKeyPress)
  }, [handleKeyPress])

  if (songName === '' || !player) {
    return null
  }

  if (!isVideoReady || !isTimerReady) {
    return <FiLoader className='loading' />
  }

  if (!player.isPlaying) {
    return (
      <MdPlayCircleOutline
        className='play-button'
        onClick={onPlay}
      />
    )
  }

  return (
    <div className='container'>
      <button
        className='stop-button'
        onClick={onStop}
      >
        <RiArrowGoBackFill />
      </button>
      {position < player.getBeats().splice(-1)[0].endTime ? (
        <div className='game-area'>
          <div className='character-area'>
            <CharacterPlaying
              songName={songName}
              player={player}
              position={position}
              isFail={isFail}
              setIsFail={setIsFail}
            />
          </div>
          <div>
            <TimerBar position={position} nowPhrase={nowPhrase} />
            <div className='now-phrase'>{nowPhrase ? nowPhrase.text : ''}</div>
            <div className='now-phrase-reading'>
              {nowPhraseReading.split('').map((v, idx) => (
                <span
                  key={idx}
                  className={idx <= passedLastCharacterIndex ? 'is-passed' : ''}
                  // スペースは幅を指定しないとつぶれる
                  style={v === ' ' ? { width: 16 } : undefined}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div className='next-phrase-area'>
            <span className='next-text'>{'NEXT: '}</span>
            <span className='next-phrase'>
              {nextPhrase ? nextPhrase.text : ''}
            </span>
          </div>
        </div>
      ) : (
        <div className='game-finish-area'>
          <div className='finish-character-area'>
            <CharacterFinish
              songName={songName}
              isSuccess={scoreRatio >= 0.8}
            />
          </div>
          <div className='result-text'>
            {scoreRatio >= 0.8 ? 'SUCCESS!' : 'FAIL...'}
          </div>
        </div>
      )}
      <div className='score-area'>
        <div className='score-title'>{'Score'}</div>
        <div className='score-content'>{`${score} / ${maxScore}`}</div>
      </div>
    </div>
  )
}
