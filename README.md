# Design with Claude Code

Claude Code を使った UI プロトタイピングのテンプレートとスキル集。

## 概要

Claude Code との対話でプロトタイプを作成し、画面マップ・実装仕様書・QAチェックリストまでワンストップで生成するワークフロー。

### できること

- 会話でUIプロトタイプを作成（ワイヤーフレーム -> リッチプロトタイプ）
- 複数パターンを一括生成して横並び比較（Compare パネル）
- 画面遷移マップの自動生成（React Flow）
- スクリーンショットの自動撮影（Playwright / 非アプリUI自動非表示）
- 実装指示書・QAチェックリストの生成
- GitHub Pages で Private リポからデプロイ & URL共有

### テンプレートに含まれるサンプル

テンプレートには **Cafe Explorer** というサンプルアプリが入っています。
States / Variants / Patterns の実装パターンを具体的なコードで確認し、
新規プロトタイプでは中身を差し替えて使ってください。

- カフェ一覧（グリッド/リスト表示、検索、フィルタ）
- カフェ詳細（メニュー/レビュータブ、カード型 vs タイムライン型レビュー）
- 各画面のローディング・空状態バリアント
- 10枚のサンプルスクリーンショット

## Quick Start

```bash
# 1. スキルを導入
cp -r skills/ ~/.claude/skills/vibe-design/

# 2. テンプレートをコピー
cp -r template/ ../my-prototype/
cd ../my-prototype/

# 3. 依存関係をインストール
npm install

# 4. 開発サーバー起動
npm run dev
# -> http://localhost:3000

# 5. Claude Code でデザイン開始
claude
```

## ディレクトリ構成

```
.
├── template/          # プロトタイプテンプレート（コピーして使う）
│   ├── src/app/
│   │   ├── globals.css       # デザイントークン（Orange系サンプル）
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
└── docs/              # 勉強会資料
    └── study-session.md
```

## スキルの導入

```bash
cp -r skills/ ~/.claude/skills/vibe-design/
```

## テンプレートの技術スタック

| 技術 | 用途 |
|------|------|
| Next.js 15 | フレームワーク（Static Export） |
| Tailwind CSS v4 | スタイリング |
| React Flow 12 | 画面マップ |
| Playwright | スクリーンショット |
| lucide-react | アイコン |
| Docker + nginx | デプロイ（Coolify等、参考） |

## ワークフロー

1. **ワイヤーフレーム**: `--wf-*` トークンでグレースケール構造
2. **リッチプロトタイプ**: ブランドカラー適用
3. **画面マップ**: `screens.ts` に定義 -> `/map` で確認
4. **スクリーンショット**: `npm run capture-screens` で全画面自動撮影（非アプリUI自動非表示）
5. **デプロイ**: GitHub Pages で URL 共有
6. **仕様書**: `/spec` に記述
7. **QA**: `/qa` にテストケース

## State / Variant / Pattern の使い分け

| 概念 | 誰が切り替える？ | 本番に残る？ | クエリパラム | 例 |
|------|-----------------|------------|-------------|-----|
| **State** | ユーザー（アプリ内UI操作） | 全て残る | `_tab=xxx` | タブ切替、グリッド/リスト表示切替 |
| **Variant** | システム（データ条件） | 全て残る | `_v=xxx` | 空状態 / ローディング / エラー |
| **Pattern** | デザイナー（設計方針の比較） | 1つだけ採用 | `_p=xxx` | カード型レビュー vs タイムライン型レビュー |

**判断基準**: アプリ内にトグルUI（切替ボタン・タブ等）があるものは **State**。
Pattern はアプリ内にトグルUIを持たず、Compare パネルのスクショリンクからのみ切り替える。

## Compare パネル

ProtoNav バー右側の **「Compare (N)」ボタン** で、プロトタイプ画面を見ながら右からドロワーが開く。

- Map のノードクリックパネルと **同じ ScreenPanel コンポーネント** を共有
- 現在の画面の States / Variants / Patterns を一覧表示
- **ページ遷移に自動追従**: 別画面に移動するとドロワー内容も自動切替
- 1/2/3/4/6 カラム切替で横並び比較
- `/map`, `/spec`, `/qa` では非表示

## デプロイ

### 推奨: GitHub Pages（Private リポ）

テンプレートに GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）が含まれています。

```bash
# 1. Private リポを作成
gh repo create your-org/proto-feature-name --private

# 2. push
git init && git add -A && git commit -m "Initial prototype"
git remote add origin https://github.com/your-org/proto-feature-name.git
git push -u origin main

# 3. GitHub Pages を有効化
# Settings > Pages > Source: "GitHub Actions" を選択
# -> push のたびに自動デプロイ
# -> https://your-org.github.io/proto-feature-name/
```

**basePath サポート**: テンプレートの `next.config.ts` は `REPO_NAME` 環境変数から `basePath` を自動設定。
GitHub Actions ワークフローで `REPO_NAME: ${{ github.event.repository.name }}` を渡すので、
サブパスデプロイ（`/<repo-name>/`）が自動的に動作します。

**アクセス制御**:
- **Enterprise Cloud**: Pages サイトをリポの read 権限を持つ人に限定可能（推奨）
- **Team**: Pages サイト自体は公開される（URLを知れば社外からもアクセス可。プロトタイプレベルなら許容範囲）

### 参考: Docker + Coolify

テンプレートには Dockerfile + nginx.conf も含まれています。
自前サーバー（Hetzner等）+ Coolify でホスティングすれば、完全にアクセスをコントロールできます。

## デザイントークンのカスタマイズ

`template/src/app/globals.css` の CSS 変数を自社のデザインシステムに合わせて書き換えてください。

```css
@theme {
  --color-primary: #YOUR_BRAND_COLOR;
  --color-primary-hover: #YOUR_HOVER_COLOR;
  /* ... */
}
```

テンプレートのサンプルは Orange 系（`#FF8900`）を使用しています。

## License

MIT
