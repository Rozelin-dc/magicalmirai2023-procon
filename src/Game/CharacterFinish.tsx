import { useMemo } from 'react'
import { SongName, songData } from '../utils/songData'

interface Props {
  songName: SongName
  isSuccess: boolean
}

export default function CharacterFinish({
  songName,
  isSuccess
}: Props) {
  const character = useMemo(() => songData[songName].character, [songName])

  return (
    <>{isSuccess}</>
  )
}
