import { useMemo } from 'react'
import { IPhrase } from 'textalive-app-api'

import './timer-bar.scss'

interface Props {
  position: number
  nowPhrase?: IPhrase
}

export default function TimerBar({ position, nowPhrase }: Props) {
  const ratio = useMemo(
    () => (nowPhrase ? 1 - nowPhrase.progress(position) : 1),
    [nowPhrase, position]
  )

  if (!nowPhrase) {
    return null
  }

  return (
    <div className='timer-container'>
      <div className='rest-time-bar' style={{ width: `${ratio * 100}%` }} />
    </div>
  )
}
