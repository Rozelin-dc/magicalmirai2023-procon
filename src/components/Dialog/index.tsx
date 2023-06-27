import React from 'react'
import { MdClose } from 'react-icons/md'

import Button from '../Button'

import './index.scss'

interface Props {
  title: string
  show: boolean
  children: React.ReactNode
  onClose(): void
  onConfirm(): void
}

export default function Dialog({
  title,
  show,
  children,
  onClose,
  onConfirm,
}: Props) {
  if (!show) {
    return null
  }

  return (
    <div onClick={onClose} className='dialog-wrapper'>
      <div onClick={(e) => e.stopPropagation()} className='dialog'>
        <div className='header'>
          {title}
          <button onClick={onClose} className='close-button'>
            <MdClose />
          </button>
        </div>
        {children}
        <div className='footer'>
          <Button type='normal' text='Cancel' onClick={onClose} />
          <Button type='primary' text='OK' onClick={onConfirm} />
        </div>
      </div>
    </div>
  )
}
