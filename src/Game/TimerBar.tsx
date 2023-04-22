import { useMemo } from 'react'
import { IPhrase } from 'textalive-app-api'
import './timer-bar.scss'

interface Props {
  position: number
  nowPhrase?: IPhrase
}

export default function TimerBar({ position, nowPhrase }: Props) {
  const duration = useMemo(() => {
    if (!nowPhrase) {
      return 0
    }
    return nowPhrase.endTime - nowPhrase.startTime
  }, [nowPhrase])
  const ratio = useMemo(() => {
    if (!nowPhrase || duration === 0) {
      return 1
    }
    return (nowPhrase.endTime - position) / duration
  }, [nowPhrase, duration, position])

  if (!nowPhrase) {
    return null
  }

  return (
    <div className='timer-container'>
      <div className='rest-time-bar' style={{ width: `${ratio * 100}%` }} />
    </div>
  )
}
