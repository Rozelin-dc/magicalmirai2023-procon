import { useCallback, useEffect, useState } from 'react'
import { MdFullscreen, MdFullscreenExit, MdSettings } from 'react-icons/md'
import { IoMdTrophy } from 'react-icons/io'

import { RomanType, romanTypes } from './utils/roman'
import Dialog from './components/Dialog'
import RadioSelection from './components/RadioSelection'
import './right-buttons.scss'

interface Props {
  isSongSelectPage: boolean
  toIndividualScorePage(): void

  romanType: RomanType
  onChangeRomanType(val: RomanType): void
}

export default function RightButtons({
  isSongSelectPage,
  toIndividualScorePage,
  romanType,
  onChangeRomanType,
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

  const fullscreenEle = document.getElementById('root')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const handleChangeScreenMode = useCallback(() => {
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      if (fullscreenEle) {
        fullscreenEle.requestFullscreen()
      }
    }
  }, [isFullscreen, fullscreenEle])
  useEffect(() => {
    if (fullscreenEle) {
      const changeFullscreen = () => {
        if (document.fullscreenElement) {
          setIsFullscreen(true)
        } else {
          setIsFullscreen(false)
        }
      }
      fullscreenEle.addEventListener('fullscreenchange', changeFullscreen)
      return () =>
        fullscreenEle.removeEventListener('fullscreenchange', changeFullscreen)
    }
  }, [fullscreenEle])

  return (
    <>
      <div className='button-container'>
        {isSongSelectPage && (
          <>
            <button onClick={toIndividualScorePage} className='button'>
              <IoMdTrophy />
            </button>
            <button
              onClick={() => setShowSettingModal(true)}
              className='button'
            >
              <MdSettings />
            </button>
          </>
        )}
        <button onClick={handleChangeScreenMode} className='button'>
          {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
        </button>
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
