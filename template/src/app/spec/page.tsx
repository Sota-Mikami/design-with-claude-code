"use client";

/**
 * 実装指示書 — Cafe Explorer サンプル
 *
 * テンプレート使用時はこの内容を実際のプロジェクトの仕様に書き換えてください。
 * プロトタイプのコンポーネントをインポートしてインライン表示できます。
 */

const sections = [
  { id: "overview", title: "概要" },
  { id: "components", title: "画面構成" },
  { id: "interactions", title: "インタラクション仕様" },
  { id: "tokens", title: "デザイントークン" },
  { id: "responsive", title: "レスポンシブ挙動" },
  { id: "edge-cases", title: "エッジケース / 状態" },
  { id: "impl-notes", title: "実装メモ" },
] as const;

function SectionNav() {
  return (
    <nav className="flex flex-wrap gap-2 mb-8 text-sm">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="px-3 py-1 rounded-full border border-border text-text-sub hover:bg-bg-surface transition-colors"
        >
          {s.title}
        </a>
      ))}
    </nav>
  );
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="text-lg font-bold mt-12 mb-4 scroll-mt-20">
      <a href={`#${id}`} className="hover:text-primary transition-colors">
        {title}
      </a>
    </h2>
  );
}

function Placeholder({ hint }: { hint: string }) {
  return (
    <div className="border border-dashed border-border rounded-lg p-6 text-text-hint text-sm">
      {hint}
    </div>
  );
}

function TokenSwatch({
  name,
  value,
  textColor,
}: {
  name: string;
  value: string;
  textColor?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-md border border-border shrink-0"
        style={{ backgroundColor: value }}
      />
      <div>
        <span className="text-sm font-mono" style={{ color: textColor }}>
          {name}
        </span>
        <span className="text-xs text-text-hint ml-2">{value}</span>
      </div>
    </div>
  );
}

export default function SpecPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">実装指示書</h1>
      <p className="text-text-sub text-sm mb-6">
        Cafe Explorer プロトタイプの実装仕様（サンプル）
      </p>

      <SectionNav />

      {/* --- 1. 概要 --- */}
      <SectionHeading id="overview" title="概要" />
      <div className="space-y-2 text-sm text-text-sub">
        <p>
          <strong className="text-text">ユーザーストーリー:</strong> ユーザーとして、近くのカフェを探して詳細情報やレビューを確認し、行きたい店を決めたい。
        </p>
        <p>
          <strong className="text-text">スコープ:</strong> 一覧画面（検索・フィルタ付き）と詳細画面（メニュー・レビュー）の2画面構成。
        </p>
      </div>

      {/* --- 2. 画面構成 --- */}
      <SectionHeading id="components" title="画面構成" />
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-medium text-text mb-2">カフェ一覧 <code className="text-xs bg-bg-surface px-1.5 py-0.5 rounded">/</code></h3>
          <ul className="list-disc list-inside text-text-sub space-y-1">
            <li>検索バー（カフェ名・エリアでフィルタ）</li>
            <li>フィルタチップ（タグベース）</li>
            <li>グリッド/リスト切替トグル</li>
            <li>カフェカード（画像・名前・エリア・評価・タグ）</li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium text-text mb-2">カフェ詳細 <code className="text-xs bg-bg-surface px-1.5 py-0.5 rounded">/cafe</code></h3>
          <ul className="list-disc list-inside text-text-sub space-y-1">
            <li>ヒーロー画像</li>
            <li>基本情報（名前・エリア・営業時間・価格帯・評価）</li>
            <li>タブ切替: Menu / Reviews</li>
            <li>Menu: カテゴリ別メニュー一覧（人気バッジ付き）</li>
            <li>Reviews: カード型 or タイムライン型（パターン比較）</li>
          </ul>
        </div>
      </div>

      {/* --- 3. インタラクション仕様 --- */}
      <SectionHeading id="interactions" title="インタラクション仕様" />
      <div className="text-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 pr-4 text-text">要素</th>
              <th className="py-2 pr-4 text-text">トリガー</th>
              <th className="py-2 pr-4 text-text">変化</th>
              <th className="py-2 text-text">duration</th>
            </tr>
          </thead>
          <tbody className="text-text-sub">
            <tr className="border-b border-border">
              <td className="py-2 pr-4">カフェカード</td>
              <td className="py-2 pr-4">hover</td>
              <td className="py-2 pr-4">shadow-bottom-200、画像 scale(1.05)</td>
              <td className="py-2">300ms ease</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-4">カフェカード名前</td>
              <td className="py-2 pr-4">hover</td>
              <td className="py-2 pr-4">text-text -> text-primary</td>
              <td className="py-2">150ms</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-4">フィルタチップ</td>
              <td className="py-2 pr-4">click</td>
              <td className="py-2 pr-4">border -> bg-primary + text-on-fill</td>
              <td className="py-2">instant</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 pr-4">タブ</td>
              <td className="py-2 pr-4">click</td>
              <td className="py-2 pr-4">border-bottom color + text-primary</td>
              <td className="py-2">150ms</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- 4. デザイントークン --- */}
      <SectionHeading id="tokens" title="デザイントークン" />
      <p className="text-sm text-text-sub mb-4">
        この画面で使用しているトークン:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TokenSwatch name="--color-primary" value="#FF8900" />
        <TokenSwatch name="--color-primary-subtle" value="#FFECE4" />
        <TokenSwatch name="--color-bg" value="#FFFFFF" />
        <TokenSwatch name="--color-bg-surface" value="#F3F3F3" />
        <TokenSwatch name="--color-text" value="#191919" />
        <TokenSwatch name="--color-text-sub" value="#7D7D7D" />
        <TokenSwatch name="--color-text-hint" value="#A7A7A7" />
        <TokenSwatch name="--color-border" value="#E5E5E5" />
      </div>

      {/* --- 5. レスポンシブ挙動 --- */}
      <SectionHeading id="responsive" title="レスポンシブ挙動" />
      <div className="text-sm text-text-sub space-y-2">
        <p><strong className="text-text">sm (640px):</strong> カフェ一覧 1列 -> 2列グリッド</p>
        <p><strong className="text-text">lg (1024px):</strong> カフェ一覧 2列 -> 3列グリッド</p>
        <p><strong className="text-text">全幅:</strong> 最大幅 max-w-5xl（一覧）/ max-w-2xl（詳細）で中央寄せ</p>
      </div>

      {/* --- 6. エッジケース / 状態 --- */}
      <SectionHeading id="edge-cases" title="エッジケース / 状態" />
      <div className="space-y-3 text-sm">
        {[
          { label: "ローディング", desc: "スケルトンUIを表示。カードのアスペクト比を維持したプレースホルダー。", link: "/?_v=loading" },
          { label: "検索結果なし", desc: "検索アイコン + 「見つかりませんでした」メッセージ + 条件変更の案内。", link: "/?_v=empty" },
          { label: "レビューなし", desc: "星アイコン + 「最初のレビューを書きましょう」CTA。", link: "/cafe?_tab=reviews&_v=no-reviews" },
        ].map((item) => (
          <div
            key={item.label}
            className="border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-text">{item.label}</span>
              <a href={item.link} className="text-xs text-primary hover:underline">
                プロトで確認 ->
              </a>
            </div>
            <p className="text-text-sub">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* --- 7. 実装メモ --- */}
      <SectionHeading id="impl-notes" title="実装メモ" />
      <div className="text-sm text-text-sub space-y-2">
        <p>
          <strong className="text-text">クエリパラメータ設計:</strong>{" "}
          <code className="bg-bg-surface px-1 rounded">_p</code>=パターン切替、
          <code className="bg-bg-surface px-1 rounded">_v</code>=バリアント、
          <code className="bg-bg-surface px-1 rounded">_tab</code>=タブ切替
        </p>
        <p>
          <strong className="text-text">画像:</strong> Unsplash の外部URLを使用（本番では自前ストレージに置き換え）
        </p>
        <p>
          <strong className="text-text">価格フォーマット:</strong> VND表記（例: 55,000d）。Intl.NumberFormat で整形。
        </p>
      </div>
    </main>
  );
}
