# Design with Claude Code

Claude Code を使った UI プロトタイピングのテンプレートとスキル集。

> **Blog**: [開発スピードを上げたくてClaude Code中心のデザイン環境を組んでみた](https://x.com/sota_mikami/status/2031351426241409115)
> — このテンプレートが生まれた背景と実際のワークフローを紹介しています。

## 誰のためのテンプレート？

**Claude Code でプロトタイプを作りたいデザイナー・PdM 向け**です。

- コードが書けなくても OK — Claude Code が全部書いてくれます
- 「ボタンを赤くして」「余白を広げて」のような自然言語でデザインを進められます
- Figma → 実装の間の「翻訳コスト」をなくし、実コードでプロトタイプを作れます

### こんな人におすすめ

- デザイン案を素早くURLで共有して、チームからフィードバックをもらいたい
- 複数パターンを作って横並び比較したい
- プロトタイプから実装仕様書・QAチェックリストまでワンストップで仕上げたい

## 前提条件

| ツール | バージョン | インストール |
|--------|-----------|-------------|
| Node.js | 20 以上 | [nodejs.org](https://nodejs.org/) |
| Claude Code | 最新 | `npm install -g @anthropic-ai/claude-code` |
| Git | - | macOS: Xcode CLT に同梱 / Windows: [git-scm.com](https://git-scm.com/) |

> **Tip**: `node -v` と `claude --version` で確認できます。

## Quick Start

```bash
# 1. リポジトリをクローン
git clone https://github.com/Sota-Mikami/design-with-claude-code.git
cd design-with-claude-code/

# 2. スキルを導入（Claude Code にワークフローを教える）
mkdir -p ~/.claude/skills
cp -r skills ~/.claude/skills/vibe-design

# 3. テンプレートをコピーして開発開始
cp -r template/ ../my-prototype/
cd ../my-prototype/
npm install

# 4. 開発サーバー起動
npm run dev
# -> http://localhost:3000

# 5. 別のターミナルを開いて、同じディレクトリで Claude Code を起動
cd ../my-prototype/
claude
# 会話例:
#   「ユーザー一覧画面のプロトタイプを作って」
#   「タブを追加して、フィルター機能をつけて」
#   「パターンBとしてカード表示バージョンも作って」
```

## できること

- **会話でUIプロトタイプを作成** — ワイヤーフレームからリッチプロトタイプまで
- **複数パターンを一括生成** — Compare パネルで横並び比較
- **画面遷移マップの自動生成** — React Flow でビジュアライズ
- **スクリーンショットの自動撮影** — Playwright で全画面一括キャプチャ
- **実装指示書・QAチェックリストの生成** — プロトタイプからそのまま
- **GitHub Pages でデプロイ & URL共有** — push するだけ

## ワークフロー

```
1. ワイヤーフレーム（グレースケールで構造を固める）
       ↓
2. リッチプロトタイプ（ブランドカラー適用）
       ↓
3. 画面マップ（screens.ts に定義 → /map で確認）
       ↓
4. スクリーンショット（npm run capture-screens）
       ↓
5. デプロイ & URL共有（GitHub Pages）
       ↓
6. 実装指示書（/spec）・QAチェックリスト（/qa）
```

### ワイヤーフレーム → リッチプロトタイプ

テンプレートにはグレースケール専用トークン（`--wf-*`）が用意されています。
まず色をつけない状態で情報設計・レイアウトを固め、承認後にブランドカラーに差し替えます。

```
--wf-accent  →  --color-primary
--wf-bg      →  --color-bg
--wf-surface →  --color-bg-surface
--wf-text    →  --color-text
```

### State / Variant / Pattern の使い分け

| 概念 | 誰が切り替える？ | 本番に残る？ | クエリパラム | 例 |
|------|-----------------|------------|-------------|-----|
| **State** | ユーザー（アプリ内UI操作） | 全て残る | `_tab=xxx` | タブ切替、グリッド/リスト |
| **Variant** | システム（データ条件） | 全て残る | `_v=xxx` | 空状態 / ローディング / エラー |
| **Pattern** | デザイナー（設計方針の比較） | 1つだけ採用 | `_p=xxx` | カード型 vs タイムライン型 |

**判断基準**: アプリ内にトグルUI（ボタン・タブ等）があれば **State**。なければ **Pattern**。

### Compare パネル

ProtoNav の **「Compare (N)」ボタン** でドロワーが開き、States / Variants / Patterns を横並び比較できます。
ページ遷移に自動追従するので、画面を切り替えても比較対象が更新されます。

## テンプレートに含まれるサンプル

テンプレートには **Cafe Explorer** というサンプルアプリが入っています。
States / Variants / Patterns の実装パターンを具体的なコードで確認できます。
新規プロトタイプでは中身を差し替えて使ってください。

- カフェ一覧（グリッド/リスト表示、検索、フィルタ）
- カフェ詳細（メニュー/レビュータブ、カード型 vs タイムライン型レビュー）
- 各画面のローディング・空状態バリアント
- 10枚のサンプルスクリーンショット

## ディレクトリ構成

```
.
├── template/          # プロトタイプテンプレート（コピーして使う）
│   ├── DESIGN.md              # デザインシステム定義（Claude Code が最初に読む）
│   ├── src/app/
│   │   ├── globals.css       # デザイントークン（Indigo系サンプル）
│   │   ├── data.ts           # サンプルデータ（カフェ情報）
│   │   ├── page.tsx          # カフェ一覧（グリッド/リスト切替）
│   │   ├── cafe/page.tsx     # カフェ詳細（メニュー/レビュー）
│   │   ├── proto-nav.tsx     # ナビバー + Compare ボタン
│   │   ├── base-path.ts      # GitHub Pages basePath ユーティリティ
│   │   ├── map/              # 画面マップ（React Flow）
│   │   ├── spec/             # 実装指示書（サンプル記入済み）
│   │   └── qa/               # QAチェックリスト（サンプル記入済み）
│   ├── scripts/              # スクリーンショット自動撮影
│   ├── public/screenshots/   # サンプルスクリーンショット（10枚）
│   ├── .github/workflows/    # GitHub Pages 自動デプロイ
│   ├── Dockerfile            # Docker デプロイ用（参考）
│   └── nginx.conf
├── skills/            # Claude Code スキルファイル
│   ├── SKILL.md              # メインワークフロー
│   ├── SCREEN_MAP_GUIDE.md   # 画面マップの使い方
│   └── SPEC_GUIDE.md         # 仕様書・QAの書き方
└── README.md
```

## 技術スタック

| 技術 | 用途 |
|------|------|
| Next.js 15 | フレームワーク（Static Export） |
| Tailwind CSS v4 | スタイリング |
| React Flow 12 | 画面マップ |
| Playwright | スクリーンショット自動撮影 |
| lucide-react | アイコン |

## デプロイ & URL共有

プロトタイプを URL で共有するまでの手順です。
テンプレートに GitHub Actions ワークフローが同梱されているので、**push するだけで自動デプロイ**されます。

> **Tip**: Claude Code に「このプロトタイプをデプロイして」と頼めば、以下の手順を代わりにやってくれます。

### 前提: GitHub CLI

デプロイ手順では [GitHub CLI (`gh`)](https://cli.github.com/) を使います。

```bash
# インストール確認
gh --version

# 未インストールの場合
brew install gh        # macOS
# インストール後、ログイン
gh auth login
```

### Step 1: GitHub リポジトリを作成

```bash
gh repo create your-org/proto-feature-name --private --source=. --push
```

このコマンドで以下が一度に実行されます:
- GitHub 上に Private リポジトリを作成
- ローカルの git を初期化（未初期化の場合）
- コードを push

> **手動で行う場合**: [github.com/new](https://github.com/new) からリポを作成し、表示される手順に従って push してください。

### Step 2: GitHub Pages を有効化

1. GitHub のリポジトリページを開く（`gh browse` で開けます）
2. **Settings** > **Pages** に移動
3. **Source** を **"GitHub Actions"** に変更して保存

### Step 3: 再度 push してデプロイ

```bash
# Pages 有効化後、ワークフローを再実行
git commit --allow-empty -m "Trigger deploy"
git push
```

push すると GitHub Actions が自動でビルド & デプロイします。
1〜2分後に以下の URL でアクセスできます:

```
https://your-org.github.io/proto-feature-name/
```

> **確認方法**: リポの **Actions** タブで、ワークフローが緑（成功）になっていれば OK です。

### アクセス制御に関する注意

GitHub Pages のサイトは**リポが Private でも URL を知っていれば誰でもアクセスできます**（GitHub Team プランの場合）。
プロトタイプレベルなら問題ないことが多いですが、公開前の施策など機密性の高い内容を扱う場合は注意してください。

| GitHub プラン | リポは Private | サイトのアクセス |
|--------------|:---:|------|
| **Enterprise Cloud** | OK | リポの read 権限を持つ人のみ閲覧可能（推奨） |
| **Team** | OK | **URL を知っていれば誰でもアクセス可能** |
| **Public リポ** | - | **完全に公開**（検索エンジンにもインデックスされる） |

> **対策の例**:
> - 機密性の高いプロトタイプは **Private リポ + Enterprise Cloud** を使う
> - Team プランの場合、簡易パスワード認証（Basic Auth）を自前で追加する
> - URL を推測しにくい名前にする（`proto-abc123` など）

### 更新するとき

コードを変更して push するだけで自動再デプロイされます。

```bash
git add -A && git commit -m "Update: 変更内容"
git push
```

### 参考: Docker

テンプレートには Dockerfile + nginx.conf も含まれています。
自前サーバー + Coolify や Fly.io 等でホスティングする場合はこちらを使ってください。

## デザイントークンのカスタマイズ

`template/src/app/globals.css` の CSS 変数を自社のデザインシステムに合わせて書き換えてください。

```css
@theme {
  --color-primary: #YOUR_BRAND_COLOR;
  --color-primary-hover: #YOUR_HOVER_COLOR;
  /* ... */
}
```

テンプレートのサンプルは Indigo 系（`#5C6AC4`）を使用しています。

## 応用: コメント機能

テンプレートのコア機能に加えて、[Liveblocks](https://liveblocks.io/) + [Supabase](https://supabase.com/) を組み合わせることで、プロトタイプ上に直接コメントをピン留めする機能を構築できます。

- プロトタイプの任意の場所にコメントをピン留め
- スレッド形式のリプライ
- メールベースのアクセス制御

> 本テンプレートにはコメント機能は含まれていません。導入に興味がある方は Issue でお気軽にご相談ください。

## スキルの仕組み

Claude Code の「スキル」は、特定のワークフローを Markdown で定義したものです。
`~/.claude/skills/` に配置すると、会話の中で自動的にそのワークフローに従って動きます。

### トリガーワード

以下の言葉を会話で使うとスキルが自動発動します:

> デザイン / プロトタイプ / モックアップ / UI設計 / ワイヤーフレーム / 実装指示書 / 仕様書 / QA / テストケース

### スキルファイル

| ファイル | 役割 |
|----------|------|
| `SKILL.md` | メインワークフロー（ワイヤーフレーム → デプロイまで） |
| `SCREEN_MAP_GUIDE.md` | 画面マップの使い方 |
| `SPEC_GUIDE.md` | 実装指示書 & QA の書き方 |

## FAQ

### Q: コードが書けなくても使える？
はい。Claude Code が全部書いてくれます。「ボタンを赤くして」「余白を広げて」のような自然言語の指示で十分です。出力されたコードの基本的な構造を理解しておくと、より的確な指示が出せるようになります。

### Q: Figma と併用できる？
できます。Figma MCP を使えば、Figma のデザインを読み込んでコードに変換できます。

### Q: デザイントークンは自社のものに差し替えられる？
はい。`globals.css` の CSS 変数を書き換えるだけです。

### Q: チーム全体で使うには？
テンプレートをクローンして、スキルファイル（`skills/`）をチームで共有してください。`globals.css` にチームのデザイントークンを設定すれば、全員が同じ基盤で作業できます。

## License

MIT
