import { RiArrowGoBackFill } from 'react-icons/ri'

import { songNames } from './utils/songData'
import { getHighScore } from './utils/individualScore'
import './individual-score.scss'

interface Props {
  onBack(): void
}

export default function IndividualScore({ onBack }: Props) {
  return (
    <div className='individual-score-container'>
      <button className='back-button' onClick={onBack}>
        <RiArrowGoBackFill />
      </button>
      <div>
        <div className='title'>{'個人成績'}</div>
        <div className='score-container'>
          <div className='song-names'>
            <div className='subtitle'>{'Song'}</div>
            {songNames.map((v) => (
              <div key={v}>{v}</div>
            ))}
          </div>
          <div className='song-scores'>
            <div className='subtitle'>{'Heigh Score'}</div>
            {songNames.map((v) => (
              <div key={v}>{getHighScore(v) ?? '-'}</div>
            ))}
          </div>
        </div>
      </div>
      <div />
    </div>
  )
}
