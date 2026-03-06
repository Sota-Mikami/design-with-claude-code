# Design with Claude Code

Claude Code を使った UI プロトタイピングのテンプレートとスキル集。

## 概要

Claude Code との対話でプロトタイプを作成し、画面マップ・実装仕様書・QAチェックリストまでワンストップで生成するワークフロー。

### できること

- 会話でUIプロトタイプを作成（ワイヤーフレーム -> リッチプロトタイプ）
- 複数パターンを一括生成して横並び比較
- 画面遷移マップの自動生成（React Flow）
- スクリーンショットの自動撮影（Playwright）
- 実装指示書・QAチェックリストの生成
- GitHub Pages で Private リポからデプロイ & URL共有

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
│   │   ├── globals.css       # デザイントークン
│   │   ├── proto-nav.tsx     # State/Variant/Pattern切替バー
│   │   ├── map/              # 画面マップ（React Flow）
│   │   ├── spec/             # 実装指示書
│   │   └── qa/               # QAチェックリスト
│   ├── scripts/              # スクリーンショット自動撮影
│   ├── .github/workflows/    # GitHub Pages 自動デプロイ
│   ├── Dockerfile            # Coolify/Docker デプロイ用（参考）
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
4. **デプロイ**: GitHub Pages で URL 共有
5. **仕様書**: `/spec` に記述
6. **QA**: `/qa` にテストケース

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
# → push のたびに自動デプロイ
# → https://your-org.github.io/proto-feature-name/
```

**アクセス制御**:
- **Enterprise Cloud**: Pages サイトをリポの read 権限を持つ人に限定可能（推奨）
- **Team**: Pages サイト自体は公開される（URLを知れば社外からもアクセス可。プロトタイプレベルなら許容範囲）

### 参考: Docker + Coolify

テンプレートには Dockerfile + nginx.conf も含まれています。
自前サーバー（Hetzner等）+ Coolify でホスティングすれば、完全にアクセスをコントロールできます。
詳細は `docs/study-session.md` を参照。

## デザイントークンのカスタマイズ

`template/src/app/globals.css` の CSS 変数を自社のデザインシステムに合わせて書き換えてください。

```css
@theme {
  --color-primary: #YOUR_BRAND_COLOR;
  --color-primary-hover: #YOUR_HOVER_COLOR;
  /* ... */
}
```

## License

MIT
