export type ScreenState = {
  id: string;
  label: string;
  query?: string;
};

export type ScreenVariant = {
  id: string;
  label: string;
  query: string;
};

export type ScreenPattern = {
  id: string;
  label: string;
  description: string;
  query: string;
  group?: string; // パターンの観点カテゴリ（例: "レビュー表示", "ヘッダー構成"）
};

export type Screen = {
  id: string;
  label: string;
  path: string;
  states: ScreenState[];
  variants?: ScreenVariant[];
  patterns?: ScreenPattern[];
  linksTo?: string[];
};

// ─── Define your screens here ───
//
// Only include screens that are part of the prototype's user flow.
// Do NOT include /spec, /qa, /map — these are meta pages, not prototype screens.
//
// ## State（状態）
//   ユーザーが能動的に操作して切り替わる画面のモード。
//   例: タブ切替、表示切替（グリッド/リスト）、入力ステップ
//   → アプリ内のUI操作で遷移する。本番に全て残る。
//   → query: "_tab=xxx" などで切り替え
//
// ## Variant（バリエーション）
//   データ条件やシステム状況で自動的に変わる表示。
//   例: ローディング中、データ0件、エラー状態
//   → ユーザーが意図して切り替えるものではない。本番に全て残る。
//   → query: "_v=xxx" で切り替え
//
// ## Pattern（パターン）
//   デザイン方針の比較検討用。「どちらの設計で行くか迷っている」時に使う。
//   例: カード型レビュー vs タイムライン型レビュー、モーダル vs ドロワー
//   → 本番では1つだけ採用する。プロトタイプ段階で比較するためのもの。
//   → query: "_p=xxx" で切り替え
//   → IMPORTANT: アプリ内にUI切替機能があるもの（グリッド/リスト表示トグル等）は
//     Pattern ではなく State として定義する。Pattern はアプリ内にトグルUIを持たない。
//
// - linksTo: IDs of screens this screen navigates to (for map arrows)

export const screens: Screen[] = [
  {
    id: "cafe-list",
    label: "カフェ一覧",
    path: "/",
    states: [
      { id: "grid", label: "グリッド表示" },
      { id: "list", label: "リスト表示", query: "_tab=list" },
    ],
    variants: [
      { id: "empty", label: "検索結果なし", query: "_v=empty" },
      { id: "loading", label: "ローディング", query: "_v=loading" },
    ],
    linksTo: ["cafe-detail"],
  },
  {
    id: "cafe-detail",
    label: "カフェ詳細",
    path: "/cafe",
    states: [
      { id: "menu", label: "メニュー", query: "_tab=menu" },
      { id: "reviews", label: "レビュー", query: "_tab=reviews" },
    ],
    variants: [
      { id: "no-reviews", label: "レビューなし", query: "_tab=reviews&_v=no-reviews" },
      { id: "loading", label: "ローディング", query: "_v=loading" },
    ],
    patterns: [
      {
        id: "card-review",
        label: "カード型レビュー",
        description: "各レビューを独立したカードで表示。視覚的な区切りが明確。",
        query: "_tab=reviews&_p=card-review",
        group: "レビュー表示",
      },
      {
        id: "timeline-review",
        label: "タイムライン型レビュー",
        description: "時系列でレビューを繋げて表示。会話の流れのように読める。",
        query: "_tab=reviews&_p=timeline-review",
        group: "レビュー表示",
      },
    ],
  },
];
