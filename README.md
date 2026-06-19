# 分岐型小説

複数の分岐型インタラクティブ小説をプレイできるサイトです。

- **トップページ**（`index.html`）— 公開中のシナリオ一覧を表示
- **プレイページ**（`scenarios/<シナリオID>/index.html`）— 各シナリオのゲーム本体

現在公開中のシナリオ：

- **隣人の手紙** — 孤独死した隣人から届く三通の手紙を届ける物語。推理と罪が交差する心理サスペンス。
- **首都直下型地震、横浜まで帰る** — 首都直下型地震発生当日、東京23区のオフィスから横浜の自宅へ帰る物語。

## プレイ方法（ローカル）

```bash
# 簡易サーバーで起動（Python 3）
python3 -m http.server 8080
```

ブラウザで http://localhost:8080 を開いてください。

または `index.html` をブラウザで直接開いても動作します。

## GitHub Pages で公開する手順

### 1. GitHub リポジトリを作成してプッシュ

```bash
git init
git add .
git commit -m "Add interactive branching novel for GitHub Pages"
git branch -M main
git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
git push -u origin main
```

### 2. GitHub Pages を有効化

1. リポジトリの **Settings** → **Pages**
2. **Source** で **Deploy from a branch** を選択
3. **Branch** を `main`、フォルダを **`/ (root)`** に設定
4. **Save**

数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

### 自動デプロイ（GitHub Actions）

`.github/workflows/pages.yml` を同梱しています。Settings → Pages で **GitHub Actions** をソースに選んでもデプロイできます。

## ゲーム仕様（首都直下型地震、横浜まで帰る）

| 項目 | 内容 |
|------|------|
| エンディング | 5種（Good / Normal / Bad / Secret） |
| 隠し選択肢 | 2周目で「防災箱を持つ」／ S03で「妻に音声通話」／ S06で「案内所を寄る」 |
| 進行保存 | エンディングコレクション・周回数を localStorage に保存（キー: `yokohama-novel-v1`） |

## ファイル構成

```
├── index.html                              # シナリオ一覧
├── css/style.css                           # 共通スタイル
├── js/
│   ├── scenarios.js                        # シナリオ一覧メタデータ
│   ├── index.js                            # 一覧ページ
│   └── game.js                             # 共通ゲームエンジン
├── scenarios/
│   ├── neighbor-letters/
│   │   ├── index.html                      # プレイページ
│   │   └── scenes.js                       # シーンデータ
│   └── yokohama-earthquake/
│       ├── index.html                      # プレイページ
│       └── scenes.js                       # シーンデータ
└── branching-earthquake-yokohama-scenario.md  # 原作シナリオ
```

## 新しいシナリオを追加する

### 1. ディレクトリを作成

`scenarios/<シナリオID>/` を作成し、次の2ファイルを置きます。

```
scenarios/my-scenario/
├── index.html    # プレイページ（yokohama-earthquake をコピーして編集）
└── scenes.js     # シーンデータ
```

`index.html` では CSS・JS のパスが `../../css/`・`../../js/` になる点に注意してください。一覧へ戻るリンクは `../../index.html` です。

### 2. 一覧に登録

`js/scenarios.js` の `SCENARIOS` 配列にメタデータを追加します。

```javascript
{
  id: 'my-scenario',              // ディレクトリ名と揃える
  title: 'シナリオのタイトル',
  hook: '一覧に表示するあらすじ（1〜2文）',
  genre: 'ジャンル名',
  version: 'v1.0',
  endings: 5,                     // エンディング数（表示用）
  path: 'scenarios/my-scenario/', // 末尾スラッシュ付き
}
```

### 3. ゲーム設定を書く

プレイページの `index.html` に `GAME_CONFIG` を定義します。シナリオごとに `storageKey` は必ず別の値にしてください（周回数・エンディングコレクションが混ざらないようにするため）。

```html
<script>
  window.GAME_CONFIG = {
    storageKey: 'my-scenario-v1',   // localStorage のキー（シナリオごとに一意）
    startScene: 'S01',              // 開始シーン ID
    endingIds: ['E01', 'E02'],      // エンディングコレクションに並べる ID
  };
</script>
<script src="scenes.js"></script>
<script src="../../js/game.js"></script>
```

| プロパティ | 説明 |
|-----------|------|
| `storageKey` | localStorage に保存するキー。シナリオごとに異なる値を使う |
| `startScene` | ゲーム開始時のシーン ID（例: `'S01'`） |
| `endingIds` | タイトル画面のエンディングコレクションに表示するシーン ID の配列 |

### 4. シーンデータを書く

`scenes.js` では次の2つのグローバル変数を定義します（`game.js` が参照します）。

- `SCENES` — シーン ID をキーにしたオブジェクト
- `ENDING_META` — エンディング種別の表示ラベル

```javascript
const SCENES = {
  S01: {
    id: 'S01',
    setting: '場面の舞台設定（任意）',
    body: '本文。関数にすると flags に応じた分岐も可能',
    choices: [
      { text: '選択肢テキスト', next: 'S02' },
      { text: '隠し選択肢', next: 'S03', hidden: true, requireSecondPlay: true },
      { text: 'フラグ付き', next: 'S04', flags: { key: true } },
    ],
  },
  E01: {
    id: 'E01',
    body: 'エンディング本文',
    ending: {
      type: 'Good',           // ENDING_META のキーと対応
      title: 'エンディング名',
      catchphrase: 'キャッチコピー',
      afterword: 'あとがき',
    },
  },
};

const ENDING_META = {
  Normal: { label: 'Normal', className: 'ending-normal' },
  Good:   { label: 'Good',   className: 'ending-good' },
  Bad:    { label: 'Bad',    className: 'ending-bad' },
  Secret: { label: 'Secret', className: 'ending-secret' },
};
```

シーンの種類:

| 種類 | プロパティ | 動作 |
|------|-----------|------|
| 分岐 | `choices` | 選択肢ボタンを表示 |
| 自動進行 | `continueTo`, `continueLabel`（任意） | 「続ける」ボタンで次シーンへ |
| エンディング | `ending` | エンディング表示＋周回数を記録 |

参考実装: `scenarios/yokohama-earthquake/` / `scenarios/neighbor-letters/`

## ゲーム仕様（隣人の手紙）

| 項目 | 内容 |
|------|------|
| エンディング | 5種（Good / Normal / Bad / Secret） |
| 隠し選択肢 | 2周目で「あの夜、ノックの音を思い出す」／ 告白ルートで「手紙に返事を書く」 |
| 進行保存 | エンディングコレクション・周回数を localStorage に保存（キー: `neighbor-letters-v1`） |

## ライセンス

シナリオ・実装ともに自由にご利用ください。
