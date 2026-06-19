# 首都直下型地震、横浜まで帰る

分岐型インタラクティブ小説。首都直下型地震発生当日、東京23区のオフィスから横浜の自宅へ——あなたの選択が帰宅の道を決めます。

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

## ゲーム仕様

| 項目 | 内容 |
|------|------|
| エンディング | 5種（Good / Normal / Bad / Secret） |
| 隠し選択肢 | 2周目で「防災箱を持つ」／ S03で「妻に音声通話」／ S06で「案内所を寄る」 |
| 進行保存 | エンディングコレクション・周回数を localStorage に保存 |

## ファイル構成

```
├── index.html          # メインページ
├── css/style.css       # スタイル
├── js/
│   ├── scenes.js       # シーンデータ
│   └── game.js         # ゲームエンジン
└── branching-earthquake-yokohama-scenario.md  # 原作シナリオ
```

## ライセンス

シナリオ・実装ともに自由にご利用ください。
