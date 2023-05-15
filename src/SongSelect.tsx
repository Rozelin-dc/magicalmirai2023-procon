import { useCallback, useState } from 'react'
import { MdSettings } from 'react-icons/md'
import { IoMdTrophy } from 'react-icons/io'

import { SongName, songNames } from './utils/songData'
import { RomanType, romanTypes } from './utils/toRoman'
import Dialog from './components/Dialog'
import RadioSelection from './components/RadioSelection'
import './song-select.scss'

interface Props {
  romanType: RomanType
  onChangeRomanType(val: RomanType): void
  onSelect(songName: SongName): void
  showIndividualScore(): void
}

export default function SongSelect({
  romanType,
  onChangeRomanType,
  onSelect,
  showIndividualScore,
}: Props) {
  const [unsavedRomanType, setUnsavedRomanType] = useState(romanType)
  const [showSettingModal, setShowSettingModal] = useState(false)
  const handleCloseSettingModal = useCallback(() => {
    setShowSettingModal(false)
    setUnsavedRomanType(romanType)
  }, [romanType])
  const handleConfirmSetting = useCallback(() => {
    onChangeRomanType(unsavedRomanType)
    setShowSettingModal(false)
  }, [unsavedRomanType])

  return (
    <>
      <div className='song-select-container'>
        <div className='button-container'>
          <button onClick={showIndividualScore} className='button'>
            <IoMdTrophy />
          </button>
          <button onClick={() => setShowSettingModal(true)} className='button'>
            <MdSettings />
          </button>
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
        <div className='caption-container'>
          <div className='caption'>
            {
              '※ローマ字表記の方式は左側の設定ボタンから変更できます(デフォルトはヘボン式です)。ただし、どの方式の場合でも長音の処理はしていません。また、読みと書きが異なる文字は、書き準拠の表記です。例えば、「歌を歌おう」は「UTAWO UTAOU」になります。'
            }
          </div>
        </div>
      </div>
      <Dialog
        title='ローマ字表記の設定'
        show={showSettingModal}
        onClose={handleCloseSettingModal}
        onConfirm={handleConfirmSetting}
      >
        <RadioSelection
          name='roman-select'
          value={unsavedRomanType}
          selectable={romanTypes}
          onChange={(v) => setUnsavedRomanType(v)}
        />
      </Dialog>
    </>
  )
}
