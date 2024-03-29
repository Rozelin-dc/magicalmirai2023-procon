export const romanTypes = ['ヘボン式', '訓令式'] as const

export type RomanType = (typeof romanTypes)[number]

export const getRomanSetting = () => {
  const setting = localStorage.getItem('roman-setting#TypingLyrics')
  if (!setting) {
    return undefined
  } else if ((romanTypes as readonly string[]).includes(setting)) {
    return setting as RomanType
  } else {
    // 不正な値が入っていた場合
    localStorage.removeItem('roman-setting#TypingLyrics')
    return undefined
  }
}

export const setRomanSetting = (romanType: RomanType) => {
  localStorage.setItem('roman-setting#TypingLyrics', romanType)
}

/** ひらがなからローマ字への変換マップ */
const romanMap: Record<string, string | Record<RomanType, string>> = {
  あ: 'A',
  い: 'I',
  う: 'U',
  え: 'E',
  お: 'O',
  か: 'KA',
  き: 'KI',
  く: 'KU',
  け: 'KE',
  こ: 'KO',
  さ: 'SA',
  し: { ヘボン式: 'SHI', 訓令式: 'SI' },
  す: 'SU',
  せ: 'SE',
  そ: 'SO',
  た: 'TA',
  ち: { ヘボン式: 'CHI', 訓令式: 'TI' },
  つ: { ヘボン式: 'TSU', 訓令式: 'TU' },
  て: 'TE',
  と: 'TO',
  な: 'NA',
  に: 'NI',
  ぬ: 'NU',
  ね: 'NE',
  の: 'NO',
  は: 'HA',
  ひ: 'HI',
  ふ: { ヘボン式: 'FU', 訓令式: 'HU' },
  へ: 'HE',
  ほ: 'HO',
  ま: 'MA',
  み: 'MI',
  む: 'MU',
  め: 'ME',
  も: 'MO',
  や: 'YA',
  ゆ: 'YU',
  よ: 'YO',
  ら: 'RA',
  り: 'RI',
  る: 'RU',
  れ: 'RE',
  ろ: 'RO',
  わ: 'WA',
  ゐ: 'WI',
  ゑ: 'WE',
  を: 'WO',
  が: 'GA',
  ぎ: 'GI',
  ぐ: 'GU',
  げ: 'GE',
  ご: 'GO',
  ざ: 'ZA',
  じ: { ヘボン式: 'JI', 訓令式: 'ZI' },
  ず: 'ZU',
  ぜ: 'ZE',
  ぞ: 'ZO',
  だ: 'DA',
  ぢ: { ヘボン式: 'JI', 訓令式: 'DI' },
  づ: { ヘボン式: 'ZU', 訓令式: 'DU' },
  で: 'DE',
  ど: 'DO',
  ば: 'BA',
  び: 'BI',
  ぶ: 'BU',
  べ: 'BE',
  ぼ: 'BO',
  ぱ: 'PA',
  ぴ: 'PI',
  ぷ: 'PU',
  ぺ: 'PE',
  ぽ: 'PO',
  いぇ: 'YE',
  うぃ: 'WI',
  うぇ: 'WE',
  きゃ: 'KYA',
  きぃ: 'KYI',
  きゅ: 'KYU',
  きぇ: 'KYE',
  きょ: 'KYO',
  くぁ: 'QA',
  くぃ: 'QI',
  くぇ: 'QE',
  くぉ: 'QO',
  くゃ: 'QYA',
  くゅ: 'QYU',
  くょ: 'QYO',
  しゃ: { ヘボン式: 'SHA', 訓令式: 'SYA' },
  しぃ: 'SYI',
  しゅ: { ヘボン式: 'SHU', 訓令式: 'SYU' },
  しぇ: 'SYE',
  しょ: { ヘボン式: 'SHO', 訓令式: 'SYO' },
  ちゃ: { ヘボン式: 'CHA', 訓令式: 'TYA' },
  ちぃ: 'TYI',
  ちゅ: { ヘボン式: 'CHU', 訓令式: 'TYU' },
  ちぇ: 'TYE',
  ちょ: { ヘボン式: 'CHO', 訓令式: 'TYO' },
  てゃ: 'THA',
  てぃ: 'THI',
  てゅ: 'THU',
  てぇ: 'THE',
  てょ: 'THO',
  にゃ: 'NYA',
  にぃ: 'NYI',
  にゅ: 'NYU',
  にぇ: 'NYE',
  にょ: 'NYO',
  ひゃ: 'HYA',
  ひぃ: 'HYI',
  ひゅ: 'HYU',
  ひぇ: 'HYE',
  ひょ: 'HYO',
  ふぁ: 'FA',
  ふぃ: 'FI',
  ふぇ: 'FE',
  ふぉ: 'FO',
  みゃ: 'MYA',
  みぃ: 'MYI',
  みゅ: 'MYU',
  みぇ: 'MYE',
  みょ: 'MYO',
  ヴぁ: 'VA',
  ヴぃ: 'VI',
  ヴ: 'VU',
  ヴぇ: 'VE',
  ヴぉ: 'VO',
  ぎゃ: 'GYA',
  ぎぃ: 'GYI',
  ぎゅ: 'GYU',
  ぎぇ: 'GYE',
  ぎょ: 'GYO',
  じゃ: { ヘボン式: 'JA', 訓令式: 'ZYA' },
  じぃ: 'ZYI',
  じゅ: { ヘボン式: 'JU', 訓令式: 'ZYU' },
  じぇ: 'ZYE',
  じょ: { ヘボン式: 'JO', 訓令式: 'ZYO' },
  ぢゃ: 'DYA',
  ぢぃ: 'DYI',
  ぢゅ: 'DYU',
  ぢぇ: 'DYE',
  ぢょ: 'DYO',
  びゃ: 'BYA',
  びぃ: 'BYI',
  びゅ: 'BYU',
  びぇ: 'BYE',
  びょ: 'BYO',
  ぴゃ: 'PYA',
  ぴぃ: 'PYI',
  ぴゅ: 'PYU',
  ぴぇ: 'PYE',
  ぴょ: 'PYO',
  ー: '-',
}

export const kanaToRoman = (str: string, type: RomanType) => {
  // str の何文字目まで変換が完了しているか (1-index)
  let convertFinishIndex = 0
  let result = ''
  while (convertFinishIndex < str.length) {
    let target = str.charAt(convertFinishIndex)
    // 「っ」から始まるかどうか
    let beginWithXtu = false
    // 前の文字が「ん」かどうか
    let beforeN = false
    convertFinishIndex += 1

    if (!target.match(/^([\u3040-\u309F]|ー)$/)) {
      // 対象の文字がひらがな以外(英数字または記号)の場合
      result += target.toUpperCase()
      continue
    }

    if (target === 'ん') {
      if (
        convertFinishIndex === str.length ||
        str.charAt(convertFinishIndex) === ' '
      ) {
        // 最後の文字か空白の前の場合
        result += 'N'
        continue
      } else {
        beforeN = true
        target = str.charAt(convertFinishIndex)
        convertFinishIndex += 1
      }
    }


    if (target === 'っ') {
      beginWithXtu = true
      target = str.charAt(convertFinishIndex)
      convertFinishIndex += 1
    }

    if (str.charAt(convertFinishIndex).match(/^[ぁぃぅぇぉゃゅょ]$/)) {
      // 次の文字が「っ」以外の小文字の場合
      target += str.charAt(convertFinishIndex)
      convertFinishIndex += 1
    }

    let res = ''
    if (typeof romanMap[target] === 'string') {
      res = romanMap[target] as string
    } else {
      res = (romanMap[target] as Record<RomanType, string>)[type]
    }

    if (beforeN) {
      if (
        type === 'ヘボン式' &&
        target.charAt(0).match(/^[まみむめもぱぴぷぺぽ]$/)
      ) {
        // 口を閉じる発音の前の「ん」はヘボン式では 'M' になる
        result += 'M'
      } else if (target.charAt(0).match(/^[あいうえお]$/)) {
        // 母音の直前の「ん」は 'NN'
        result += 'NN'
      } else {
        result += 'N'
      }
      beforeN = false
    }

    if (beginWithXtu) {
      // 「っ」は次の文字入力の最初の一文字を繰り返す
      result += res.charAt(0)
    }

    result += res
  }

  return result
}
