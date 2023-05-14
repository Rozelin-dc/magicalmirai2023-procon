import { useEffect, useMemo, useState } from 'react'
import { Player } from 'textalive-app-api'

import { SongName, songData } from '../../utils/songData'
import mikuRunningA from '../../assets/Miku/running-a.webp'
import mikuRunningB from '../../assets/Miku/running-b.webp'
import mikuRunningC from '../../assets/Miku/running-c.webp'
import mikuRunningD from '../../assets/Miku/running-d.webp'
import mikuTrip from '../../assets/Miku/trip.webp'
import kaitoRunningA from '../../assets/KAITO/running-a.webp'
import kaitoRunningB from '../../assets/KAITO/running-b.webp'
import kaitoRunningC from '../../assets/KAITO/running-c.webp'
import kaitoRunningD from '../../assets/KAITO/running-d.webp'
import kaitoTrip from '../../assets/KAITO/trip.webp'
import '../character-img.scss'

const imgSrc = {
  Miku: {
    running: {
      a: mikuRunningA,
      b: mikuRunningB,
      c: mikuRunningC,
      d: mikuRunningD,
    },
    trip: mikuTrip,
  },
  KAITO: {
    running: {
      a: kaitoRunningA,
      b: kaitoRunningB,
      c: kaitoRunningC,
      d: kaitoRunningD,
    },
    trip: kaitoTrip,
  },
}

interface Props {
  songName: SongName
  player: Player
  position: number
  isFail: boolean
  setIsFail(newVal: boolean): void
}

export default function CharacterPlaying({
  songName,
  player,
  position,
  isFail,
  setIsFail,
}: Props) {
  // 現在のキャラクターの状態
  const [nowState, setNowState] = useState<'running' | 'fail'>('running')
  // 走っている状態のコマ送り
  const [runningState, setRunningState] = useState<'a' | 'b' | 'c' | 'd'>('b')
  const [lastActionPosition, setLastActionPosition] = useState<number>()

  const character = useMemo(() => songData[songName].character, [songName])

  useEffect(() => {
    if (isFail) {
      // ミスタイプした
      setNowState('fail')
      setLastActionPosition(position)
      setIsFail(false)
    }
  }, [isFail])

  useEffect(() => {
    // 状態が 'running' 以外になってから一定時間経った
    if (lastActionPosition && position - lastActionPosition > 700) {
      setLastActionPosition(undefined)
      setNowState('running')
    }
  }, [position])

  useEffect(() => {
    const beat = player.findBeat(position)
    if (!beat) {
      return
    }
    // 拍に合わせて1秒に1回程度走るようにする
    const timesRunInBeat = Math.max(1, Math.round(beat.duration / 500))
    const duration = beat.duration / timesRunInBeat
    const relativePosition = (position - beat.startTime) % duration
    if (relativePosition < duration / 2) {
      if (runningState === 'b') {
        setRunningState('c')
      } else if (runningState === 'd') {
        setRunningState('a')
      }
    } else {
      if (runningState === 'a') {
        setRunningState('b')
      } else if (runningState === 'c') {
        setRunningState('d')
      }
    }
  }, [player, position])

  return (
    <div className='character-img-container'>
      {nowState === 'running' ? (
        <img
          src={imgSrc[character].running[runningState]}
          className='character-img'
        />
      ) : (
        <img src={imgSrc[character].trip} className='character-img' />
      )}
    </div>
  )
}
