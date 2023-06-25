import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IPhrase, Player } from 'textalive-app-api'

import { SongName } from '../../utils/songData'
import { formatPhraseText } from '../../utils/formatPhraseText'

import CharacterPlaying from './CharacterPlaying'
import TimerBar from './TimerBar'
import './index.scss'

interface Props {
  songName: SongName
  player: Player
  position: number
  lyricsReadingRoman: string[]
  onSuccess(): void
}

export default function GamePlaying({
  songName,
  player,
  position,
  lyricsReadingRoman,
  onSuccess,
}: Props) {
  const [nowPhrase, setNowPhrase] = useState<IPhrase>()
  const [nextPhrase, setNextPhrase] = useState<IPhrase>()
  const [nowPhraseReading, setNowPhraseReading] = useState('')
  // nowPhrase が歌詞中の何番目のフレーズか
  const nowPhraseIndex = useRef(-1)

  // 表示用のフレーズの歌詞
  const [nowPhraseText, setNowPhraseText] = useState('')
  const nextPhraseText = useMemo(
    () => (nextPhrase ? formatPhraseText(nextPhrase) : ''),
    [nextPhrase]
  )

  // nowPhraseReading の何文字目までタイプできたか
  const [passedLastCharacterIndex, setPassedLastCharacterIndex] = useState(-1)

  const [isFail, setIsFail] = useState(false)

  useEffect(() => {
    // 再生中の処理
    if (nowPhrase && nowPhrase.endTime < position) {
      // フレーズの歌唱時間が終わった
      setNowPhrase(undefined)
      setNowPhraseReading('')
      setNowPhraseText('')
    }
    if (nextPhrase && nextPhrase.startTime <= position) {
      // 次のフレーズの歌唱時間がはじまろうとしている
      nowPhraseIndex.current += 1
      setNowPhraseReading(lyricsReadingRoman[nowPhraseIndex.current])
      setNowPhrase(nextPhrase)
      setNowPhraseText(nextPhraseText)
      setNextPhrase(nextPhrase.next)
      setPassedLastCharacterIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position])

  useEffect(() => {
    // 楽曲が変わった際の初期化
    setPassedLastCharacterIndex(-1)
    nowPhraseIndex.current = -1
    setNowPhraseReading('')
    setNowPhrase(undefined)
    setNextPhrase(player.video.firstPhrase)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if (!e.key.match(/^[a-zA-Z0-9'-]$/)) {
        // タイピング対象は英数字とシングルクォート、ハイフンのみなので、それ以外はスキップ
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
    [nowPhraseReading, onSuccess, passedLastCharacterIndex]
  )

  useEffect(() => {
    // キー入力に反応するように
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className='game-area'>
      <CharacterPlaying
        songName={songName}
        player={player}
        position={position}
        isFail={isFail}
        setIsFail={setIsFail}
      />
      <div>
        <TimerBar position={position} nowPhrase={nowPhrase} />
        <div className='now-phrase'>{nowPhraseText}</div>
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
        <span className='next-phrase'>{nextPhraseText}</span>
      </div>
    </div>
  )
}
