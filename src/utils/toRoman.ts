export const romanTypes = ['ヘボン式', '訓令式'] as const

export type RomanType = (typeof romanTypes)[number]

/**
 * ひらがなからローマ字への変換マップ
 */
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
  ん: 'NN',
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
  // str の何文字目まで変換が完了しているか
  let convertFinishIndex = -1
  let result = ''
  while (convertFinishIndex < str.length) {
    let target = str.charAt(convertFinishIndex + 1)
    // 「っ」から始まるかどうか
    let beginWithXtu = false
    convertFinishIndex += 1

    if (!target.match(/^([\u3040-\u309F]|ー)$/)) {
      // 対象の文字がひらがな以外(英数字または記号)の場合
      result += target.toUpperCase()
      continue
    }

    if (target === 'っ') {
      beginWithXtu = true
      target = str.charAt(convertFinishIndex + 1)
      convertFinishIndex += 1
    }

    if (str.charAt(convertFinishIndex + 1).match(/^[ぁぃぅぇぉゃゅょ]$/)) {
      // 次の文字が「っ」以外の小文字の場合
      target += str.charAt(convertFinishIndex + 1)
      convertFinishIndex += 1
    }

    let res = ''
    if (typeof romanMap[target] === 'string') {
      res = romanMap[target] as string
    } else {
      res = (romanMap[target] as Record<RomanType, string>)[type]
    }

    if (beginWithXtu) {
      result += res.charAt(0)
    }

    result += res
  }

  return result
}
