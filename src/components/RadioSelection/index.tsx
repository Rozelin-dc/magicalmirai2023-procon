import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md'

import './index.scss'

interface Props<T extends string> {
  name: string
  value: T
  selectable: readonly T[]
  onChange(newVal: T): void
}

export default function RadioSelection<T extends string>({
  name,
  value,
  selectable,
  onChange,
}: Props<T>) {
  return (
    <div className='selection-container'>
      {selectable.map((v) => (
        <label key={v} className='radio-button-container'>
          <input
            type='radio'
            name={name}
            value={v}
            checked={v === value}
            onChange={(e) => onChange(e.target.value as T)}
            style={{ display: 'none' }}
          />
          {v === value ? (
            <MdRadioButtonChecked className='radio-button checked' />
          ) : (
            <MdRadioButtonUnchecked className='radio-button unchecked' />
          )}
          <span className='radio-button-label'>{v}</span>
        </label>
      ))}
    </div>
  )
}
