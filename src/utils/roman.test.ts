import { beforeEach, describe, expect, test } from 'vitest'

import { getRomanSetting, kanaToRoman, setRomanSetting } from './roman'

describe('kanaToRoman', () => {
  test('ヘボン式と訓令式で結果が同じになる変換', () => {
    expect(kanaToRoman('おはよう', 'ヘボン式')).toEqual('OHAYOU')
    expect(kanaToRoman('おはよう', '訓令式')).toEqual('OHAYOU')
  })

  test('ヘボン式と訓令式で結果が異なる変換', () => {
    expect(kanaToRoman('あした', 'ヘボン式')).toEqual('ASHITA')
    expect(kanaToRoman('あした', '訓令式')).toEqual('ASITA')
  })

  test('「っ」が正しく変換できる', () => {
    expect(kanaToRoman('あった', 'ヘボン式')).toEqual('ATTA')
    expect(kanaToRoman('あった', '訓令式')).toEqual('ATTA')
  })

  test('その他小さい文字が正しく変換できる', () => {
    expect(kanaToRoman('かいしゃ', 'ヘボン式')).toEqual('KAISHA')
    expect(kanaToRoman('かいしゃ', '訓令式')).toEqual('KAISYA')
  })

  test('通常の「ん」が正しく変換できる', () => {
    expect(kanaToRoman('あんた', 'ヘボン式')).toEqual('ANTA')
    expect(kanaToRoman('あんた', '訓令式')).toEqual('ANTA')
  })

  test('文末の「ん」が正しく変換できる', () => {
    expect(kanaToRoman('あん', 'ヘボン式')).toEqual('AN')
    expect(kanaToRoman('あん', '訓令式')).toEqual('AN')
  })

  test('閉じる口の直前の「ん」が正しく変換できる', () => {
    expect(kanaToRoman('あんみつ', 'ヘボン式')).toEqual('AMMITSU')
    expect(kanaToRoman('あんみつ', '訓令式')).toEqual('ANMITU')
  })

  test('母音の直前の「ん」が正しく変換できる', () => {
    expect(kanaToRoman('あんい', 'ヘボン式')).toEqual('ANNI')
    expect(kanaToRoman('あんい', '訓令式')).toEqual('ANNI')
  })

  test('空白が含まれていても正しく変換できる', () => {
    expect(kanaToRoman('あん あった しゃ', 'ヘボン式')).toEqual('AN ATTA SHA')
    expect(kanaToRoman('あん あった しゃ', '訓令式')).toEqual('AN ATTA SYA')
  })

  test('「ん」の直後に小文字を含む文字列があってもが正しく変換できる', () => {
    expect(kanaToRoman('かんしゃ', 'ヘボン式')).toEqual('KANSHA')
    expect(kanaToRoman('かんしゃ', '訓令式')).toEqual('KANSYA')
  })

  test('「ん」の直後に「っ」があってもが正しく変換できる', () => {
    expect(kanaToRoman('わんって', 'ヘボン式')).toEqual('WANTTE')
    expect(kanaToRoman('わんって', '訓令式')).toEqual('WANTTE')
  })
})

describe('getRomanSetting, setRomanSetting', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('正しい値が出し入れできる', () => {
    setRomanSetting('ヘボン式')
    expect(getRomanSetting()).toEqual('ヘボン式')
  })

  test('不正な値が入っていた場合', () => {
    localStorage.setItem('roman-setting#TypingLyrics', 'hoge')
    expect(getRomanSetting()).toEqual(undefined)
    expect(localStorage.getItem('roman-setting#TypingLyrics')).toEqual(null)
  })
})
