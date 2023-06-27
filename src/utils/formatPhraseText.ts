import { IPhrase, IWord } from 'textalive-app-api'

/** IPhrase.text は英単語の間の意味のある空白も消されてしまっているので、適宜空白を挿入した文字列を作る */
export const formatPhraseText = (phrase: IPhrase) => {
  let text = ''
  phrase.children.forEach((word) => {
    text += word.text
    if (
      word !== phrase.lastWord &&
      isOnlyAlphabetOrNumberWord(word) &&
      isOnlyAlphabetOrNumberWord(word.next)
    ) {
      // 英数字のみの単語に挟まれているならスペースを挿入
      text += ' '
    }
  })
  return text
}

const isOnlyAlphabetOrNumberWord = (word: IWord) => {
  return word.text.match(/^[a-zA-Z0-9']+$/) !== null
}
