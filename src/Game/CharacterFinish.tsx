import { useMemo } from 'react'

import { SongName, songData } from '../utils/songData'
import mikuFail from '../assets/Miku/fail.webp'
import mikuSuccess from '../assets/Miku/success.webp'
import kaitoFail from '../assets/KAITO/fail.webp'
import kaitoSuccess from '../assets/KAITO/success.webp'

import './character-img.scss'

const imgSrc = {
  Miku: {
    fail: mikuFail,
    success: mikuSuccess,
  },
  KAITO: {
    fail: kaitoFail,
    success: kaitoSuccess,
  },
}

interface Props {
  songName: SongName
  isSuccess: boolean
}

export default function CharacterFinish({ songName, isSuccess }: Props) {
  const character = useMemo(() => songData[songName].character, [songName])

  return (
    <div className='character-img-container' style={{ flex: 1 }}>
      {isSuccess ? (
        <img src={imgSrc[character].success} className='character-img' />
      ) : (
        <img src={imgSrc[character].fail} className='character-img' />
      )}
    </div>
  )
}
