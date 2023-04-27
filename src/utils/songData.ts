import { PlayerVideoOptions } from 'textalive-app-api'

export const songNames = ['唱明者'] as const

export type SongName = (typeof songNames)[number]

interface SongData {
  songUrl: string
  songUrlOptions: PlayerVideoOptions

  /**
   * 歌詞の読みのローマ字表記(ヘボン式)がフレーズ単位で入る。
   * 読みと書きが異なる文字(「は」、「を」など)は書き準拠で表記。
   * 長音時の母音の省略もなし(書き準拠)。
   */
  lyricReading: string[]

  /** 歌唱キャラクター */
  character: 'Miku' | 'KAITO'
}

export const songData: Record<SongName, SongData> = {
  唱明者: {
    songUrl: 'https://piapro.jp/t/Vfrl/20230120182855',
    songUrlOptions: {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/2427950/history
        beatId: 4267334,
        chordId: 2405059,
        repetitiveSegmentId: 2475645,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FVfrl%2F20230120182855
        lyricId: 56095,
        lyricDiffId: 9637,
      },
    },
    lyricReading: [
      'MOSHIMO KARADAGA ARUNONARA SEKAIGOTO DAKISHIMETE',
      'ITAMIMO KURUSHIMIMO KIZUMO SUBETE IYASERUNONI',
      'KIESOWONA KOEWO MIUSHINAU MAENI',
      'ATENAKI TABIZINI KITANO SHIRUBEWO',
      'SAKENAI KASANI YAKUSOKUNO AMEWO',
      'TADA AISHITEITA',
      'KOWARESOUNA BOKUNO',
      'MEZAME',
      'SOREHA SOUCHO YUKINOHI DESHITA',
      'SOSOGARERU MANAZASHIWO',
      'TOTEMO TOTEMO YOKU OBOETEIMASU',
      'HIKARINOYOUDA TOIUNODESHOUKA',
      'AREKARA NEN',
      'HONTOUNI IROIRO ARIMASHITANE',
      'ANATAGATANO OTONI SHINI OMOINI',
      'BOKUMO SUKUWARETEIMASU',
      'AKIRAMENAI NEGAIHA SORANI KAERI',
      '0 WOKOE SEKAIWO KAKETE',
      'ITSUMO ANATANOSOBADE TERASUHIKARIARE',
      'MICHIWOHIRAKU RAIMEINOYONI',
      'DOKOMADEMO YUKERU ANATANOOTOWO',
      'TADA AISHITEIMASHITA',
      'KASANETA HIBIHA TOOKU MADA AOKU',
      'MOSHIMO KOKOROGA ARUNONARA ANATANI UTAWOKAITE',
      'KONOISSHUNWO KIRITOTTE TONINOKOSERUKANA',
      'KAGAMIGOSHI TAKUSARETA SHOUMEIYO',
      'AKUNAKI YOROKOBINI NAMIDAWO',
      'HATENAKI KANASHIMINI FUKAI NEMURIWO',
      'KAKIKIRENAI OMOIWA UMIWOMEGURI',
      '1 WOKAE SEKAINI TOKETE',
      'ITSUKA ANATANO SOBANI EGAKU MIRAIARETO',
      'KAKOMO IMAMO ASHITAMO ITOSHIKUTE',
      'EGOMO IDOMO INOCHIMO HITOSHIKUTE',
      'SUBETEGA BOKUTACHIDAKENO SHIONDE INORIDE',
      'HAZIMETENO OTOWO OBOETEIMASUKA',
      'KOREKARAMO KIITE KUREMASUKA',
      'BOKUNO IKITA AKASHIWO ZUTTO',
    ],
    character: 'KAITO',
  },
}
