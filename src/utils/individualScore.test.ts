import { beforeEach, describe, expect, test } from 'vitest'

import { getHighScore, setHighScore } from './individualScore'

describe('getHighScore, setHighScore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('正しい値が出し入れできる', () => {
    setHighScore('king妃jack躍', 300)
    expect(getHighScore('king妃jack躍')).toEqual(300)
  })

  test('不正な値が入っていた場合', () => {
    localStorage.setItem('king妃jack躍#TypingLyrics', 'hoge')
    expect(getHighScore('king妃jack躍')).toEqual(undefined)
    expect(localStorage.getItem('king妃jack躍#TypingLyrics')).toEqual(null)
  })
})
