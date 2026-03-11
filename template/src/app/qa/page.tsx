"use client";

import { useState, useEffect } from "react";

/**
 * QA チェックリスト — Cafe Explorer サンプル
 *
 * テンプレート使用時はこの内容を実際のテストケースに書き換えてください。
 * チェック状態は localStorage に保存されます。
 */

type Priority = "P0" | "P1" | "P2";

interface TestCase {
  id: string;
  title: string;
  steps: string[];
  expected: string;
  priority: Priority;
}

interface QASection {
  id: string;
  title: string;
  cases: TestCase[];
}

const priorityStyles: Record<Priority, string> = {
  P0: "bg-negative-subtle text-negative",
  P1: "bg-info-subtle text-info",
  P2: "bg-bg-surface text-text-sub",
};

const templateSections: QASection[] = [
  {
    id: "cafe-list",
    title: "カフェ一覧",
    cases: [
      {
        id: "list-1",
        title: "一覧表示: グリッド <-> リスト切替",
        steps: [
          "トップページを開く",
          "右上のグリッド/リストトグルをクリックする",
          "表示が切り替わることを確認する",
        ],
        expected: "グリッド表示（3列）とリスト表示が切り替わり、カフェ情報が正しく表示される",
        priority: "P0",
      },
      {
        id: "list-2",
        title: "空状態: 検索結果なし",
        steps: [
          "/?_v=empty にアクセスする",
          "空状態のUIが表示されることを確認する",
        ],
        expected: "「見つかりませんでした」メッセージと検索条件変更の案内が表示される",
        priority: "P1",
      },
      {
        id: "list-3",
        title: "ローディング状態",
        steps: [
          "/?_v=loading にアクセスする",
          "スケルトンUIが表示されることを確認する",
        ],
        expected: "カードのスケルトン（アニメーション付き）が6枚表示される",
        priority: "P1",
      },
    ],
  },
  {
    id: "cafe-detail",
    title: "カフェ詳細",
    cases: [
      {
        id: "detail-1",
        title: "タブ切替: メニュー -> レビュー",
        steps: [
          "/cafe を開く（メニュータブがデフォルト）",
          "「Reviews」タブをクリックする",
          "レビュー一覧が表示されることを確認する",
        ],
        expected: "タブの下線がReviewsに移動し、レビューカードが表示される",
        priority: "P0",
      },
      {
        id: "detail-2",
        title: "レビュー表示パターン: カード型 vs タイムライン型",
        steps: [
          "/cafe?_tab=reviews にアクセス（カード型）",
          "/cafe?_tab=reviews&_p=timeline-review にアクセス（タイムライン型）",
          "両方の表示を比較する",
        ],
        expected: "カード型は独立カード、タイムライン型は縦線で繋がった表示になる",
        priority: "P0",
      },
      {
        id: "detail-3",
        title: "レビューなし状態",
        steps: [
          "/cafe?_tab=reviews&_v=no-reviews にアクセスする",
        ],
        expected: "「まだレビューがありません」+ 「レビューを書く」CTAが表示される",
        priority: "P1",
      },
    ],
  },
  {
    id: "navigation",
    title: "ナビゲーション",
    cases: [
      {
        id: "nav-1",
        title: "一覧 -> 詳細への遷移",
        steps: [
          "トップページのカフェカードをクリックする",
        ],
        expected: "カフェ詳細画面に遷移する",
        priority: "P0",
      },
      {
        id: "nav-2",
        title: "詳細 -> 一覧への戻り",
        steps: [
          "/cafe を開く",
          "「Back」リンクをクリックする",
        ],
        expected: "カフェ一覧画面に戻る",
        priority: "P0",
      },
      {
        id: "nav-3",
        title: "ProtoNav のタブ切替",
        steps: [
          "上部ナビの Prototype / Map / Spec / QA を順にクリックする",
        ],
        expected: "各ページに正しく遷移し、アクティブタブがハイライトされる",
        priority: "P1",
      },
    ],
  },
];

const STORAGE_KEY = "qa-check-state";

function useCheckedState() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setChecked(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const reset = () => {
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return { checked, toggle, reset };
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityStyles[priority]}`}
    >
      {priority}
    </span>
  );
}

function TestCaseCard({
  tc,
  isChecked,
  onToggle,
}: {
  tc: TestCase;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        isChecked
          ? "border-positive bg-positive-subtle/30"
          : "border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="mt-1 w-4 h-4 accent-positive shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <PriorityBadge priority={tc.priority} />
            <span
              className={`font-medium text-sm ${
                isChecked ? "line-through text-text-hint" : "text-text"
              }`}
            >
              {tc.title}
            </span>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-text-sub font-medium">手順:</p>
            <ol className="list-decimal list-inside text-text-sub space-y-0.5 pl-1">
              {tc.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p className="text-text-sub mt-2">
              <span className="font-medium">期待結果:</span> {tc.expected}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QAPage() {
  const { checked, toggle, reset } = useCheckedState();

  const allCases = templateSections.flatMap((s) => s.cases);
  const checkedCount = allCases.filter((c) => checked[c.id]).length;
  const totalCount = allCases.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">QA チェックリスト</h1>
        <button
          onClick={reset}
          className="text-xs text-text-hint hover:text-text-sub transition-colors px-2 py-1 border border-border rounded"
        >
          リセット
        </button>
      </div>
      <p className="text-text-sub text-sm mb-6">
        Cafe Explorer プロトタイプのテストケース（サンプル）
      </p>

      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-text-sub">進捗</span>
          <span className="font-mono text-text-sub">
            {checkedCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 bg-bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-positive rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* セクションナビ */}
      <nav className="flex flex-wrap gap-2 mb-8 text-sm">
        {templateSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="px-3 py-1 rounded-full border border-border text-text-sub hover:bg-bg-surface transition-colors"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {/* テストケース */}
      {templateSections.map((section) => (
        <section key={section.id} className="mb-10">
          <h2
            id={section.id}
            className="text-lg font-bold mb-4 scroll-mt-20"
          >
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.cases.map((tc) => (
              <TestCaseCard
                key={tc.id}
                tc={tc}
                isChecked={!!checked[tc.id]}
                onToggle={() => toggle(tc.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
