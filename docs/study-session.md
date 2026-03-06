# Design with Claude Code 勉強会

## はじめに：なぜ Claude Code でデザインするのか

### デザインの課題
- Figma → 実装の間に「翻訳コスト」が発生する
- プロトタイプツール（Figma, InVision等）は見た目だけで実際の挙動を検証できない
- 複数案のパターン比較を作るのに時間がかかる
- 実装仕様書・QAケースが別工程になりがち

### Claude Code で解決できること
- **実コードでプロトタイプ**を作るので、そのまま実装の土台になる
- **会話しながら反復**できる（「このボタンをもっと右に」「タブの順番を変えて」）
- **複数パターンを一括生成**して比較できる
- 仕様書・QAケースまでワンストップで生成できる

---

## 実例：生徒詳細画面（student-detail-v2）

### どんな画面？
LMS（学習管理システム）の先生向け生徒詳細画面。学習状況の把握・管理を行う。

### 実際の成果物
- プロトタイプURL: https://student-detail.proto.duong-sm.com
- 画面マップ: https://student-detail.proto.duong-sm.com/map
- 実装指示書: https://student-detail.proto.duong-sm.com/spec
- QAチェックリスト: https://student-detail.proto.duong-sm.com/qa

### 作った画面の構成
| 画面 | 内容 |
|------|------|
| 教室詳細（トップ） | 生徒一覧テーブル |
| 生徒詳細 | 概要 / 学習ログ / プロフィールの3タブ |
| 生徒編集 | プロフィール編集フォーム |

### デザイン検討で比較したパターン例
- **詳細表示**: 展開（アコーディオン） / ドロワー / モーダル の3パターン
- **テスト範囲表示**: バッジ / テキストリンク / バナー 等5パターンを比較 → テキストリンクに決定
- **概要カード**: サマリーカード4枚 → 日別積み上げチャートに変更

---

## ワークフロー：6ステップ

### Step 1: デザイントークン読み込み
Claude Code にデザインシステム（色・余白・フォント）を読み込ませる。
テンプレートの `globals.css` にトークンが定義済み。

### Step 2: ワイヤーフレーム（グレースケール）
グレーのワイヤーフレーム専用トークン（`--wf-*`）で構造だけ先に作る。

```
ワイヤーフレームモードのトークン:
  --wf-bg:       #FFFFFF  （背景）
  --wf-surface:  #F5F5F5  （カード・セクション）
  --wf-border:   #E0E0E0  （区切り線）
  --wf-text:     #333333  （本文）
  --wf-text-sub: #888888  （補助テキスト）
  --wf-accent:   #666666  （ボタン等の強調）
```

**ポイント**: 色をつけない段階で情報設計・レイアウトを固める

### Step 3: リッチプロトタイプ（カラー適用）
ワイヤーフレームが承認されたら、ブランドカラーに差し替え。

```
--wf-accent  → --color-primary
--wf-bg      → --color-bg
--wf-surface → --color-bg-surface
--wf-text    → --color-text
```

インタラクション（hover, transition, アニメーション）もこの段階で追加。

### Step 3.5: Screen Map（画面マップ）
`screens.ts` に画面定義を書くと、React Flow で画面遷移図が自動生成される。

**3つの軸で画面バリエーションを管理**:
| 概念 | 用途 | クエリパラム | 色 |
|------|------|-------------|-----|
| **State** | タブ切替などの表示モード | `_tab=xxx` | グレー |
| **Variant** | データ条件（空, ローディング） | `_v=xxx` | オレンジ |
| **Pattern** | デザイン代替案（案A vs 案B） | `_p=xxx` | バイオレット |

スクリーンショットの自動撮影（Playwright）で、全パターンを一括キャプチャ。
マップ画面のサイドパネルで横並び比較。

### Step 4: デプロイ & URL共有

ビルドしてホスティングし、URLをSlackで共有。

#### 推奨: GitHub Pages（最もシンプル）

Private リポジトリで GitHub Pages を使う方法。社内メンバーなら誰でもすぐ始められる。

```bash
npm run build
# out/ に静的ファイルが生成される
```

GitHub Actions で自動デプロイ（テンプレートに `.github/workflows/deploy.yml` 同梱）:
1. Private リポに push
2. GitHub Actions が自動ビルド → Pages にデプロイ
3. `https://<org>.github.io/<repo>/` でアクセス

**アクセス制御について**:
| GitHub プラン | リポは Private | サイトのアクセス |
|--------------|:---:|------|
| **Enterprise Cloud** | OK | リポの read 権限を持つ人のみ閲覧可能（推奨） |
| **Team** | OK | URLを知っていれば誰でもアクセス可（※） |

※ Team プランの場合、サイトURLは検索エンジンにインデックスされないが、URLを知れば社外からもアクセスできる。プロトタイプレベルなら許容範囲だが、機密性の高い施策は Enterprise Cloud の Private Pages を推奨。

#### 参考: Coolify を使う方法（上級者向け）

自前のサーバー（Hetzner等）+ Coolify でホスティングする方法。完全にアクセスをコントロールできるが、インフラの準備が必要。

```bash
# Dockerビルド → Coolifyにデプロイ → 独自ドメインでURL共有
bash proto-deploy.sh student-detail student-detail-v2
# → https://student-detail.proto.duong-sm.com
```

student-detail-v2 プロジェクトではこの方法を使用。テンプレートに Dockerfile + nginx.conf が含まれているので、Docker 対応のホスティングならどこでも動く。

### Step 5: 実装指示書
`/spec` ページに仕様をまとめる。プロトタイプのコンポーネントをインポートして
実際のUIをインライン表示しながら仕様を書ける。

セクション構成:
1. 概要（目的・ユーザーストーリー）
2. 画面構成（コンポーネント一覧 + ライブプレビュー）
3. インタラクション仕様（状態遷移テーブル）
4. デザイントークン（使用トークンのスウォッチ）
5. レスポンシブ挙動
6. エッジケース（エラー、空、ローディング）
7. 実装メモ（API、データ型）

### Step 6: QA チェックリスト
`/qa` ページにテストケースを生成。
ブラウザ上でチェックボックスを切り替えながらテスト進捗管理（localStorage保存）。

優先度3段階:
- **P0**: リリースブロッカー
- **P1**: 重要だが回避策あり
- **P2**: あると良い

---

## テンプレートの中身

### テンプレートに含まれるもの

```
template/
├── src/app/
│   ├── globals.css          # デザイントークン（色・余白・フォント・影）
│   ├── layout.tsx           # ルートレイアウト + ProtoNav
│   ├── page.tsx             # トップページ（ここから作り始める）
│   ├── proto-nav.tsx        # State/Variant/Pattern 切替バー
│   ├── map/
│   │   ├── screens.ts      # 画面定義（中央設定）
│   │   ├── page.tsx         # React Flow キャンバス
│   │   ├── screen-node.tsx  # ノード表示コンポーネント
│   │   └── screen-panel.tsx # サイドパネル（スクショ比較）
│   ├── spec/page.tsx        # 実装指示書テンプレート
│   └── qa/page.tsx          # QA チェックリスト
├── scripts/
│   └── capture-screens.ts   # Playwright スクショ自動撮影
├── Dockerfile               # マルチステージビルド（Node → nginx）
├── nginx.conf               # 静的配信 + ヘルスチェック
├── package.json             # Next.js 15 + Tailwind v4 + React Flow
└── next.config.ts           # Static Export 設定
```

### 技術スタック
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 15 | フレームワーク（Static Export） |
| Tailwind CSS | v4 | スタイリング |
| React Flow | 12 | 画面マップのキャンバス |
| Playwright | 1.58 | スクリーンショット自動撮影 |
| lucide-react | - | アイコン |
| Docker + nginx | - | デプロイ用 |

---

## Claude Code スキルの仕組み

### スキルとは？
Claude Code に特定のワークフローを教え込む仕組み。
`~/.claude/skills/` にMarkdownで手順を書いておくと、会話の中で自動的にそのワークフローに従って動く。

### Vibe Design スキルの構成
| ファイル | 役割 |
|----------|------|
| `SKILL.md` | メインワークフロー（6ステップ） |
| `SCREEN_MAP_GUIDE.md` | 画面マップの使い方 |
| `SPEC_GUIDE.md` | 実装指示書 & QA の書き方 |
| `DEPLOY_GUIDE.md` | デプロイ手順 |
| `PENCIL_GUIDE.md` | Pencil（キャンバスツール）連携 |

### トリガーワード
以下の言葉を会話で使うとスキルが自動発動:

> デザイン / プロトタイプ / モックアップ / UI設計 / 画面設計 / ワイヤーフレーム / 実装指示書 / 仕様書 / QA / テストケース / ハンドオフ / 施策を探して / 改善案を出して

---

## 使ってみる：セットアップ手順

### 1. テンプレートを取得
```bash
git clone https://github.com/mikan-company/design-with-claude-code.git
cd design-with-claude-code/
```

### 2. スキルを導入
```bash
cp -r skills/ ~/.claude/skills/vibe-design/
```

### 3. プロトタイプを作り始める
```bash
cp -r template/ ../my-prototype/
cd ../my-prototype/
npm install
npm run dev
# → http://localhost:3000
```

### 4. Claude Code でデザイン開始
```bash
claude
# 会話例:
# 「ユーザー一覧画面のプロトタイプを作って」
# 「タブを追加して、フィルター機能をつけて」
# 「パターンBとしてカード表示バージョンも作って」
```

### 5. デプロイして共有
```bash
# Private リポを作成して push
gh repo create mikan-company/proto-my-feature --private
git init && git add -A && git commit -m "Initial prototype"
git remote add origin https://github.com/mikan-company/proto-my-feature.git
git push -u origin main

# GitHub Pages を有効化（Settings > Pages > Source: GitHub Actions）
# → push するたびに自動デプロイ
# → https://mikan-company.github.io/proto-my-feature/
```

---

## こんなこともできる（応用 & 未来像）

### 今できること
- **施策探索モード**: 「施策を探して」で競合調査 → 施策提案 → 一括プロトタイプ生成
- **Figma 連携**: Figma の MCP で既存デザインを読み込み → コードに変換
- **Pencil 連携**: キャンバスに画面を並べて手書きメモを追加
- **パターン一括比較**: 1つの `screens.ts` に複数パターンを定義 → マップで横並び比較

### 近い未来にできそうなこと
- **デザインシステム同期**: 既存の Figma デザインシステムとトークンを自動同期
- **ユーザーテスト自動化**: Playwright でプロトタイプのユーザーフローを自動テスト
- **A/Bテスト生成**: 複数パターンを個別URLでデプロイし、実ユーザーでテスト
- **アクセシビリティ自動チェック**: プロトタイプ段階で WCAG 準拠を検証
- **レスポンシブ自動キャプチャ**: モバイル / タブレット / デスクトップの3サイズでスクショ比較
- **Storybook 自動生成**: プロトタイプのコンポーネントから Storybook を自動生成
- **デザインレビュー AI**: スクリーンショットを Claude に見せて UX レビュー

### デザイナーの役割はどう変わる？
| Before | After |
|--------|-------|
| Figma でピクセル単位の調整 | 構造・情報設計に集中 |
| 仕様書を別途作成 | プロトタイプから自動生成 |
| 「実装したら違った」 | 実コードなので齟齬がない |
| パターン比較に時間がかかる | 会話で一括生成 → 即比較 |
| デザイン → 実装が一方向 | 対話型で双方向に改善 |

---

## Q&A（よくある質問）

### Q: コードが書けなくても使える？
A: 使えます。Claude Code が全部書いてくれます。「ボタンを赤くして」「余白を広げて」のような自然言語の指示で十分です。ただし、出力されたコードの基本的な構造を理解しておくと、より的確な指示が出せます。

### Q: Figma と併用できる？
A: できます。Figma MCP を使えば、Figma のデザインを読み込んでコードに変換できます。逆にプロトタイプのスクリーンショットを Figma に持っていくことも可能です。

### Q: デザイントークンは自社のものに差し替えられる？
A: はい。`globals.css` のCSS変数を自社のトークンに書き換えるだけです。

### Q: チーム全体で使うには？
A: テンプレートリポジトリをクローンして、`DESIGN.md` に自社のデザインシステムを記述。`skills/` ディレクトリを共有すれば、チーム全員が同じワークフローで作業できます。
