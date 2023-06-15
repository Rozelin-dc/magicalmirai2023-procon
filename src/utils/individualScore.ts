import { SongName } from './songData'

export const getHighScore = (songName: SongName) => {
  const data = localStorage.getItem(`${songName}#TypingLyrics`)
  if (!data) {
    return undefined
  }

  const score = Number(data)
  if (!Number.isNaN(score)) {
    return score
  } else {
    // 不正な値が入っていた場合
    localStorage.removeItem(`${songName}#TypingLyrics`)
    return undefined
  }
}

export const setHighScore = (songName: SongName, score: number) => {
  localStorage.setItem(`${songName}#TypingLyrics`, `${score}`)
}
