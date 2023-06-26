import { useEffect, useMemo, useRef, useState } from 'react'
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

import './character-playing.scss'

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

  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const [backgroundLineSpeed, setBackgroundLineSpeed] = useState(0)

  const isChorus = useMemo(
    () => player.findChorus(position) !== null,
    [player, position]
  )

  useEffect(() => {
    if (isFail) {
      // ミスタイプした
      setNowState('fail')
      setLastActionPosition(position)
      setIsFail(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFail])

  useEffect(() => {
    // 状態が 'running' 以外になってから一定時間経った
    if (lastActionPosition && position - lastActionPosition > 700) {
      setLastActionPosition(undefined)
      setNowState('running')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // 走るスピードと後ろの光のスピードを合わせる
    setBackgroundLineSpeed(duration * 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, position])

  // サビで背景に光の線がランダムに表示されるように
  useEffect(() => {
    if (!isChorus || !backgroundRef.current) {
      return
    }

    if (Math.random() < 0.3) {
      // そのままだと線の数が多すぎるので適当に間引く
      return
    }

    const span = document.createElement('span')
    const hex = Math.random() * 360
    span.className = 'line'
    span.style.top = `${Math.random() * 100}%`
    span.style.width = `${30 + Math.random() * 30}px`
    span.style.backgroundColor = `hsl(${hex}, 100%, 70%)`
    span.style.boxShadow = `0 0 12px hsl(${hex}, 100%, 85%)`
    span.style.animationDuration = `${backgroundLineSpeed}ms`
    span.addEventListener('animationend', () => {
      backgroundRef.current?.removeChild(span)
    })
    backgroundRef.current.appendChild(span)
  }, [backgroundLineSpeed, isChorus, position])

  return (
    <div style={{ contain: 'strict' }}>
      <div
        ref={backgroundRef}
        className='full-container'
        style={{
          zIndex: 0,
        }}
      />
      <div
        className='character-img-container full-container'
        style={{
          zIndex: 1,
        }}
      >
        <img
          src={imgSrc[character].running.a}
          className='character-img'
          style={{
            width:
              nowState === 'running' && runningState === 'a' ? undefined : 0,
          }}
        />
        <img
          src={imgSrc[character].running.b}
          className='character-img'
          style={{
            width:
              nowState === 'running' && runningState === 'b' ? undefined : 0,
          }}
        />
        <img
          src={imgSrc[character].running.c}
          className='character-img'
          style={{
            width:
              nowState === 'running' && runningState === 'c' ? undefined : 0,
          }}
        />
        <img
          src={imgSrc[character].running.d}
          className='character-img'
          style={{
            width:
              nowState === 'running' && runningState === 'd' ? undefined : 0,
          }}
        />
        <img
          src={imgSrc[character].trip}
          className='character-img'
          style={{ width: nowState === 'fail' ? undefined : 0 }}
        />
      </div>
    </div>
  )
}
