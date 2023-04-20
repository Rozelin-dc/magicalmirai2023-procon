import { SongName, songData } from './utils/songData'
import './index.css'
import './song-select.css'

interface Props {
  onSelect(songName: SongName): void
}

export default function SongSelect({ onSelect }: Props) {
  const songNames = Object.keys(songData) as SongName[]

  return (
    <div className='container'>
      <div />
      <div>
        <div className='title'>{'Select Song'}</div>
        <ul className='selection'>
          {songNames.map((v) => (
            <li key={v} onClick={() => onSelect(v)}>
              {v}
            </li>
          ))}
        </ul>
      </div>
      <div className='caption'>
        {
          '※ローマ字表記はヘボン式です。ただし、長音の処理はしていません(「あおう」-> 「AOU」になります)。読みと書きが異なる文字(「を」など)は、書き準拠の表記です。'
        }
      </div>
    </div>
  )
}
