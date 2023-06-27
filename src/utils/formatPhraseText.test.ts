import { describe, expect, test } from 'vitest'
import { IPhrase, IWord } from 'textalive-app-api'

import { formatPhraseText } from './formatPhraseText'

const makeMockPhrase = (words: string[]) => {
  const children = words.map(
    (word, idx, array) =>
      ({
        text: word,
        next: idx < array.length ? ({ text: array[idx + 1] } as IWord) : {},
      } as IWord)
  )
  return {
    text: words.join(''),
    children,
    lastWord: children[children.length - 1],
  } as IPhrase
}

describe('formatPhraseText', () => {
  test('日本語だけのフレーズ', () => {
    expect(formatPhraseText(makeMockPhrase(['こんにちは', '世界']))).toEqual(
      'こんにちは世界'
    )
  })

  test('英語だけのフレーズ', () => {
    expect(formatPhraseText(makeMockPhrase(['Hello', 'world']))).toEqual(
      'Hello world'
    )
  })

  test('英単語が連続しない日本語と英語が混ざったフレーズ', () => {
    expect(formatPhraseText(makeMockPhrase(['こんにちは', 'world']))).toEqual(
      'こんにちはworld'
    )
  })

  test('英単語が連続する日本語と英語が混ざったフレーズ', () => {
    expect(
      formatPhraseText(makeMockPhrase(['こんにちは', 'hello', 'world']))
    ).toEqual('こんにちはhello world')
  })
})
