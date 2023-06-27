import { SongName, songNames } from './utils/songData'
import './song-select.scss'

interface Props {
  onSelect(songName: SongName): void
}

export default function SongSelect({
  onSelect
}: Props) {
  return (
    <div className='song-select-container'>
      <div className='caption-container'>
        <div className='caption'>
          {
            '※ローマ字表記の方式は右側の設定ボタンから変更できます(デフォルトはヘボン式です)。ただし、どの方式の場合でも長音の処理はしていません。また、読みと書きが異なる文字は、書き準拠の表記です。例えば、「歌を歌おう」は「UTAWO UTAOU」になります。'
          }
        </div>
      </div>
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
      <div />
    </div>
  )
}
