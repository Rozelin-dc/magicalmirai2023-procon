import { useMemo } from 'react'
import { SongName, songData } from '../utils/songData'
import './score.css'

interface Props {
  songName: SongName | ''
  score: number
}

export default function Score({ songName, score }: Props) {
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

  return (
    <>
    <div className='score-title'>{'Score'}</div>
    <div className='score-container'>
      {`${score}/${maxScore}`}
    </div>
    </>
  )
}
