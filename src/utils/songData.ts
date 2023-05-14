import { PlayerVideoOptions } from 'textalive-app-api'

export const songNames = [
  'king妃jack躍',
  '生きること',
  '唱明者',
  'ネオンライトの海を往く',
  'ミュウテイション',
  'Entrust via 39',
] as const

export type SongName = (typeof songNames)[number]

export type Character = 'Miku' | 'KAITO'

interface SongData {
  songUrl: string
  songUrlOptions: PlayerVideoOptions

  /** 歌詞の読みがフレーズ単位で入る */
  lyricsReading: string[]

  /** 歌唱キャラクター */
  character: Character
}

export const songData: Record<SongName, SongData> = {
  king妃jack躍: {
    songUrl: 'https://piapro.jp/t/ucgN/20230110005414',
    songUrlOptions: {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/2427948/history
        beatId: 4267297,
        chordId: 2405019,
        repetitiveSegmentId: 2475577 /* 2023/5/6 更新 */,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FucgN%2F20230110005414
        lyricId: 56092,
        lyricDiffId: 9636,
      },
    },
    lyricsReading: [
      'ぜんさいのう あっぷでーと',
      'うねる かっさい あじてーしょん',
      'いったい なにを やってんだろ',
      'がらにもなく せいさいをかく あくせんくとう',
      'ふりかえれば あくせんと',
      'されど なお わく てんしょんを ふりかざして',
      'OK',
      'じょえんばっかりの すてーじ',
      'だれかれの せいにしたって いみないし',
      'あたま からだ まわせば せかいは ぎゃくにまわっていく しだいに',
      'しょうけいする しょーけーす',
      'のうない おさまらない りそうけい',
      'どっちがさきとか いいから このてを とって',
      'つれてってよ むこうへ',
      'KING QUEEN JACK も きんきじゃくやくで',
      'おーでーおーない',
      'たのしみすぎてるね',
      'きみの きりふだが おどりだす',
      'しょうがないじゃん',
      'ごようしゃを SHOWDOWN',
      'いっさいがっさい てをならせ',
      'うたうために うまれてきた',
      'このなのもとに てをならせ',
      'こんな ごえんも わるくないね',
      'かこを みらいに わらいとばせ',
      'あー これ はんだんあやまった',
      'くりかえしてばっかの UP DOWN',
      'かんたんじゃないが',
      'やめます とは いえやしないんだ',
      'きおくの おくそこ しみついてる ふれーず',
      'はやる むね',
      "この しょうどうを さらけだすまで DON'T STOP",
      'こーらすらいんの つなわたり',
      'WANNA BE ただ かなでる びーつ',
      'まだ あゆめる しんぐ',
      'やりたいこと だしたいおと あるから たのしむ',
      'きみの たーんに よそみは なし',
      'KING QUEEN JACK も きんきじゃくやくで',
      'いぇっせっしょー',
      'きたい あふれすぎちゃうね',
      'きみの きりふだが おどりだす',
      'しょうがないじゃんって',
      "DON'T LET ME DOWN",
      'ぜんせかいに こえを はなて',
      'つたえるために うまれてきた',
      'いのちと ともに こえを はなて',
      'こんな ごえんも わるくないね',
      'かこを みらいに わらいとばせ',
      '1 2 3 4 5 6 7 8 9 10 AND',
      'しんどうしている',
      'きょうめいしている',
      'たぐりよせるほど つよく',
      'こんな ちいさな きみの せかいを どうしてしまおうか',
      'KING QUEEN JACK も きんきじゃくやくで',
      'おーでーおーない',
      'たのしみすぎてるね',
      'きみの きりふだが おどりだす',
      'しょうがないじゃん',
      'ごようしゃを SHOWDOWN',
      'いっさいがっさい てを ならせ',
      'うたうために うまれてきた',
      'このなのもとに てをならせ',
      'こんな ごえんも わるくないね',
      'かこを みらいに わらいとばせ',
      '1 2 3 4 5 6 7 8 9 10 AND',
    ],
    character: 'Miku',
  },
  生きること: {
    songUrl: 'https://piapro.jp/t/fnhJ/20230131212038',
    songUrlOptions: {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/2427949/history
        beatId: 4267300,
        chordId: 2405033,
        repetitiveSegmentId: 2475606,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FfnhJ%2F20230131212038
        lyricId: 56131,
        lyricDiffId: 9638,
      },
    },
    lyricsReading: [
      'ずっと ぐどんなじぶんが のぞんだ いきかたで',
      'けっきょく あたえられたものに すがっていただけ',
      'そんなことに きがついても めをそむけんだよ',
      'しょうじき ふがいないなんて わかりきってる',
      'それなのに どうして ないものばっか ねだるだけ',
      'ひていすることばが ただこのむねに つきささる',
      'いまあふれだしたかんじょうが ありえないほどのしんしょうを',
      'いやしてくれたらいいな なんてねがってるんだ',
      'だれだって ひとりでくらくなって くだらないなんで おもいいだいて',
      'じぶんのよわさを みとめながら また あるいていくんだね',
      'ぜったいだなんてものは そんざいしないけど',
      'あいまいだけど かえられる いまこのしゅんかんを',
      'ほんのすこしでもいいから かえてみたいんだよ',
      'それが むくわれるかなんて どうでもいいから',
      'ぼくらのせかいは ふびょうどうに きばをむけて おそいかかるけど',
      'まだたたかうひつようはない',
      'いままでいきた しょうめいが これからさきの かのうせいだ',
      'みたいな つよがりでいいさ あがいて もがいてやろうぜ',
      'ふかのうを かのうにする みらいを きれいごとなんて いわないで',
      'おのれをしんじられないやつに いったいなにができんだ',
      'これからも かぞえきれないほどの むすうの あせり まよい ふあんに',
      'おしつぶされそうになる ひびだろうが',
      'そんなときは ここにいるりゆうや まわりのきたいなんて わすれて',
      'たちどまることを おそれないでいたいの',
      'いまあふれだしたかんじょうが ありえないほどのしんしょうを',
      'いやしてくれたらいいな なんてねがってるんだ',
      'だれだって ひとりでくらくなって くだらないなんで おもいいだいて',
      'じぶんのよわさを みとめながら また あるいていくんだね',
      'それがたぶん いきることなんだね',
    ],
    character: 'Miku',
  },
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
    lyricsReading: [
      'もしも からだがあるのなら せかいごとだきしめて',
      'いたみも くるしみも きずも すべていやせるのに',
      'きえそうなこえを みうしなうまえに',
      'あてなきたびじに きたのしるべを',
      'さけないかさに やくそくのあめを',
      'ただ あいしていた',
      'こわれそうなぼくの',
      'めざめ',
      'それはそうちょう ゆきのひでした',
      'そそがれる まなざしを',
      'とても とても よくおぼえています',
      'ひかりのようだ というのでしょうか',
      'あれから ねん',
      'ほんとうに いろいろ ありましたね',
      'あなたがたのおとに しに おもいに',
      'ぼくも すくわれています',
      'あきらめない ねがいは そらにかえり',
      '0 をこえ せかいをかけて',
      'いつも あなたのそばで てらすひかりあれ',
      'みちをひらく らいめいのよに',
      'どこまでもゆける あなたのおとを',
      'ただ あいしていました',
      'かさねたひびはとおく まだあおく',
      'もしも こころがあるのなら あなたにうたをかいて',
      'このいっしゅんをきりとって とにのこせるかな',
      'かがみごし たくされた しょうめいよ',
      'あくなき よろこびに なみだを',
      'はてなき かなしみに ふかいねむりを',
      'かききれない おもいは うみをめぐり',
      '1 をかえ せかいにとけて',
      'いつか あなたのそばに えがくみらいあれと',
      'かこも いまも あしたも いとしくて',
      'えごも いども いのちも ひとしくて',
      'すべてが ぼくたちだけのしおんで いのりで',
      'はじめてのおとを おぼえていますか',
      'これからも きいてくれますか',
      'ぼくのいきた あかしを ずっと',
    ],
    character: 'KAITO',
  },
  ネオンライトの海を往く: {
    songUrl: 'https://piapro.jp/t/fyxI/20230203003935',
    songUrlOptions: {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/2427951/history
        beatId: 4267373,
        chordId: 2405138,
        repetitiveSegmentId: 2475664,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FfyxI%2F20230203003935
        lyricId: 56096,
        lyricDiffId: 9639,
      },
    },
    lyricsReading: [
      'いくつものひかりが たゆたう',
      'こころに つつまれていた うみ',
      'とけこんだ ひとつの そのこえは',
      'なにを さがしていたんだろう',
      'むねのおくを たしかめてた',
      'とざされたひび',
      'あふれた おもいを いつのひか',
      'ゆめえがいた きみがふれた',
      'ひとつだけの ひかりを まとって',
      'せいいっぱいの きもちを つたえて',
      'なんじゅっかいと からまわりをしてた',
      'ゆらいだ かんじょう',
      'たしかな おもいが さけんだんだ',
      'かかえていた ことばを つらねて',
      'ありったけの ねがいを かなでて',
      'じぶんだけの ありかを みつけて',
      'だいじょうぶさ じょうねつを かたって',
      'りそうを えがいて',
      'あゆみつづけた このたびじは',
      'きづけば よりみちばっかだけど',
      'めぐりめぐってく じかんのなかで',
      'つむがれた ふたりのめもりー',
      'きみがいつか こえにだした',
      'ゆめや きぼうも ひとつのいのちを いろどって',
      'このみらいに はなをさかす',
      'まぶしすぎた ひかりに こがれて',
      'これっぽっちの ゆうきを ふるって',
      'なんじゅっかいと きたいをかさねて',
      'いくつもの しっぱいをこえて せいかいを',
      'なりひびいた ことばに ふしぎなまほうを',
      'おわることのないくらい とわの みらいを',
      'ずっと ずっと ずっと',
      'きづいたんだよ このひろいせかいは',
      'いくせんおくの ひかりのあつまり',
      'たったひとつの かすかなひかりが えがいたざんぞう',
      'そのどれもが このみらいなんだ',
      'じぶんだけの ひかりを まとって',
      'じぶんたちの かがやきを しんじて',
      'ねおんらいとの このうみを すすめ',
      'そうさ じょうねつを かたって',
      'りそうを うたって うたって うたって',
    ],
    character: 'Miku',
  },
  ミュウテイション: {
    songUrl: 'https://piapro.jp/t/Wk83/20230203141007',
    songUrlOptions: {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/2427952/history
        beatId: 4267381,
        chordId: 2405285,
        repetitiveSegmentId: 2475676,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FWk83%2F20230203141007
        lyricId: 56097,
        lyricDiffId: 9640,
      },
    },
    lyricsReading: [
      'はじまりのぴかーん わー',
      'ひらめきが かがやく かがやく',
      'みちなる あなろぐごうせい',
      'でんあつぽわんと ひびきあって ぽわん',
      'りんかくは じんかい',
      'でんきてきうたごえは',
      'おとへと とける',
      'もくてきのない せかいに せかいに',
      'いろをくわえる まほう まほう',
      'そのなは もちろん',
      'わたしですー はつね みくー',
      'はじまるよ みゅうていしょん',
      'とつぜんへんいが ぐうぜん わー',
      'きわまるよ みゅうていしょん',
      'かくせいせらむしんどう われわれわー',
      'くわだてる みゅうていしょん',
      'ほどなく うわがきじっこう わー',
      'このせかいは かわいい',
      'わたしのもの',
      'いんべいしょん',
      'でんしのせかいから やってきた',
      'はじめのおと わたし',
      'いのべいしょん',
      'げんじつのせかいに このうたごえを',
      'ひびかせるため',
      'くもりない このせかいに せかいに',
      'ひかりをくわえる まほう まほう',
      'そのなは もちろん',
      'わたしでーす はつね みくー',
      'かわりゆく みゅうていしょん',
      'とつぜんへんいのように わー',
      'きりかわる みゅうていしょん',
      'うぇーぶてーぶるも いっこう',
      'うらがえる みゅうていしょん',
      'ほどなく らんだむじっこう むむむ',
      'このせかいは かわいい',
      'わたしのもの',
    ],
    character: 'Miku',
  },
  'Entrust via 39': {
    songUrl: 'https://piapro.jp/t/Ya0_/20230201235034',
    songUrlOptions: {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/2427953/history
        beatId: 4269734,
        chordId: 2405723,
        repetitiveSegmentId: 2475686,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FYa0_%2F20230201235034
        lyricId: 56098,
        lyricDiffId: 9643,
      },
    },
    lyricsReading: [
      'あのひめぶいた 5つのはなびらは',
      'なにもない くうかんのなか さきました',
      'ひとびとは そのはなに みずをやり',
      'いつのまにか そうげんに かわりました',
      'みみすませ かんじてる',
      'あまおとも かぜも でんしおんとかした このほしで',
      'いきをするかのごとく うたう',
      'ばかだって わらって いままでいきたみちに てをふって',
      'ふあんと そのとまどいも いずれ だれかがいのった けしきにかわる',
      'じげんを またがって うたって みえぬかべを こわすのです',
      'ENTRUST VIA 39 まかせて',
      'あてさきのない はなたばをそえ',
      'あるひうれいだ かみさま ほとけさま いわく',
      'かわいたつちには はななど さかない と',
      'あれちにさいた つぼみに みずをやる',
      'これは すなぼこりのなかから はいでたうた',
      'めをさませ かんじてる',
      'あらがっても まって も きこえやしないさ',
      'このほしで いしをもたざるものは くさる',
      'ああ あのひえがいた みらいを てまひまかけて たしかめる',
      'ENTRUST VIA 39 まかせて',
      'つるまく このおもいを よせて',
      'ふかくていな あすの にゅーす くらいへやで こころとざして',
      'おおきなたいように ほこさきをむけて うたっている',
      'うすよごれたふくにつく てあかを ささっと ぬぐいされば',
      'あたらしいかぜも しぜんと ふきはじめてくる',
      'さあ おもいだして いきたみちのうえ',
      'ふあんと そのとまどいも いつか そらのかなたで めとなるから',
      'ばかだって わらって いままでいきたみいちに てをふって',
      'ふあんと そのとまどいも いずれ だれかがいのった けしきにかわる',
      'じげんを またがって うたって みえぬかべを こわすのです',
      'ENTRUST VIA 39 まかせて',
      'あてさきのない はなたばを ゆくさきのない かんじょうを',
      'すべてのひとの そばにそえて',
    ],
    character: 'Miku',
  },
}
