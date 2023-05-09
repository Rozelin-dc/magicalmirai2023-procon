# Typing Lyrics
## 概要
- タイトル
  - Typing Lyrics
- 対応楽曲
  - king妃jack躍
  - 生きること
  - 唱明者
  - ネオンライトの海を往く
  - ミュウテイション
  - Entrust via 39

楽曲の歌詞を、そのフレーズが歌唱中にタイピングしきることを目標にするタイピングゲームを作りました。

私たちが歌詞をタイピングすることでパワーを送信し、その力でミクさん達ヒーローが前進できるという世界観で作りました。ミクさんは楽曲のテンポに合わせて走りますが、ミスタイプすると転倒してしまいます。また、最終スコアが満点の八割を超えたかどうかで楽曲終了後の演出が変化します。

## スクリーンショット
### 選曲画面
再生する楽曲を選択します。マウスホバーされている楽曲は文字色が変わります。

### 楽曲再生中

#### ミスタイプ時

### 楽曲終了後
#### スコアが八割を超えた時

#### スコアが八割を超えなかった時

### 歌唱キャラクターの違いによる登場キャラクターの変化
『唱明者』を選曲すると、ミクさんではなくKAITOさんが登場します。

## デモ
サイトで実際に試す: https://rozelin-dc.github.io/magicalmirai2023-procon/

## ポイント
### 演出面
- 誰でも楽しめるよう、アクセシビリティへの配慮をしました
  - 使っている文字色は、背景と十分にコントラスト比があるようにしました
- どこかのコンピュータールームからミクさん達にパワーを送信しているという世界観に合わせたデザインを心掛けました

### 実装面
- 読みやすいコードになるよう心がけました
  - 処理の単位ごとに適切にコンポーネントに分割したほか、コメントの充実や変数への切り出しに努めました
  - コミットメッセージも開発の履歴や変更意図が分かりやすいようにしました
- TypeScriptの型情報を有効活用して安全なコードになるようにしました

## 使用技術
- TextAliveAppAPI
- React(TypeScript)
  - react-icons
- Sass
- Vite(ビルドツール)

## 実行方法
### モジュールインストール
node v16, npm v8を想定して開発しています
```bash
npm i
```

### 開発用サーバー起動
http://localhost:2323 で起動します
```bash
npm run dev
```

### ビルド
`./docs`にビルド成果物が配置されます
```bash
npm run build
```

## ディレクトリ構造
```txt
├── docs: ビルド成果物置き場
├── public: favicon置き場
├── screenshots: このMDで示したスクリーンショット置き場
├── src: 実装部分のコード置き場
│   ├── assets: ロゴ・イラスト置き場
│   ├── components: 共通コンポーネント置き場
│   ├── utils: 共通のデータやロジックの実装
│   ├── Game: 選曲後に必要な画面の要素やロジックの実装
│   │   └── GamePlaying: 楽曲再生中に固有な画面の要素やロジックの実装
│   ├── App.tsx: メインの画面の実装
│   └── SongSelect.tsx: 楽曲選択画面の実装
└── README.md: このファイル
```

## 動作環境
PCでの動作を前提としています。
- Windows
  - Chrome, Firefox, Edge で動作確認しています
- Mac
  - 所持していない為動作確認できていません
  - 万が一正常に動作しない場合はお手数ですがWindows環境での利用をお願いします
  - iPadと外部キーボードを利用した疑似的なMac環境では、Safari, Chrome で動作確認しています