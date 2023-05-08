import { useEffect, useMemo, useState } from 'react'
import { Player } from 'textalive-app-api'

import { SongName, songData } from '../utils/songData'

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
    const timesRunInBeat = Math.max(1, Math.round(beat.duration / 1000))
    const duration = beat.duration / timesRunInBeat
    const relativePosition = (position - beat.startTime) % duration
    if (relativePosition < (duration / 2)) {
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
    <>{`${nowState}: ${runningState}`}</>
  )
}
