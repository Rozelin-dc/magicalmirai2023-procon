import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IPhrase, Player } from 'textalive-app-api'

import { SongName, songData } from '../../utils/songData'

import CharacterPlaying from './CharacterPlaying'
import TimerBar from './TimerBar'
import './index.scss'

interface Props {
  songName: SongName
  player: Player
  position: number
  onSuccess(): void
}

export default function GamePlaying({
  songName,
  player,
  position,
  onSuccess,
}: Props) {
  const lyricsReading = useMemo(
    () => songData[songName].lyricsReading,
    [songName]
  )
  const [nowPhrase, setNowPhrase] = useState<IPhrase>()
  const [nextPhrase, setNextPhrase] = useState<IPhrase>()
  const [nowPhraseReading, setNowPhraseReading] = useState('')
  // nowPhrase が歌詞中の何番目のフレーズか
  const nowPhraseIndex = useRef(-1)

  // nowPhraseReading の何文字目までタイプできたか
  const [passedLastCharacterIndex, setPassedLastCharacterIndex] = useState(-1)

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
      setNowPhraseReading(lyricsReading[nowPhraseIndex.current])
      setNowPhrase(nextPhrase)
      setNextPhrase(nextPhrase.next)
      setPassedLastCharacterIndex(-1)
    }
  }, [position])

  useEffect(() => {
    // 楽曲が変わった際の初期化
    setPassedLastCharacterIndex(-1)
    nowPhraseIndex.current = -1
    setNowPhraseReading('')
    setNowPhrase(undefined)
    setNextPhrase(player.video.firstPhrase)
  }, [songName])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) {
        // キーが押しっぱなしになっている
        return
      }

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
        onSuccess()
      } else {
        // ミスタイプした
        setIsFail(true)
      }
    },
    [nowPhraseReading, passedLastCharacterIndex]
  )

  useEffect(() => {
    // キー入力に反応するように
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
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
        <span className='next-phrase'>{nextPhrase ? nextPhrase.text : ''}</span>
      </div>
    </div>
  )
}
