import { SongName } from './songData'

export const getHighScore = (songName: SongName) => {
  const data = localStorage.getItem(`${songName}#TypingLyrics`)
  if (data) {
    return Number(data)
  } else {
    return undefined
  }
}

export const setHighScore = (songName: SongName, score: number) => {
  localStorage.setItem(`${songName}#TypingLyrics`, `${score}`)
}
