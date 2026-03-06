"use client";

import { useState, useEffect } from "react";

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
    id: "basic-flow",
    title: "Basic Flow",
    cases: [
      {
        id: "basic-1",
        title: "Happy path: complete main flow",
        steps: [
          "Open the screen",
          "Perform the main action",
          "Verify the result",
        ],
        expected: "Expected result goes here",
        priority: "P0",
      },
    ],
  },
  {
    id: "variations",
    title: "Variations",
    cases: [
      {
        id: "var-1",
        title: "Input: minimum value",
        steps: ["Operate with minimum input"],
        expected: "Processes normally",
        priority: "P1",
      },
      {
        id: "var-2",
        title: "Input: maximum value",
        steps: ["Operate with maximum input"],
        expected: "Processes normally",
        priority: "P1",
      },
    ],
  },
  {
    id: "edge-cases",
    title: "Edge Cases",
    cases: [
      {
        id: "edge-1",
        title: "Error: network disconnect",
        steps: ["Operate while offline"],
        expected: "Error message is displayed",
        priority: "P0",
      },
      {
        id: "edge-2",
        title: "Boundary: empty data",
        steps: ["Open screen with 0 records"],
        expected: "Empty state UI is shown",
        priority: "P1",
      },
    ],
  },
  {
    id: "non-functional",
    title: "Non-functional",
    cases: [
      {
        id: "nf-1",
        title: "Performance: initial load",
        steps: ["Open screen without cache"],
        expected: "Displays within 3 seconds",
        priority: "P1",
      },
      {
        id: "nf-2",
        title: "Accessibility: keyboard navigation",
        steps: ["Navigate all elements using Tab key"],
        expected: "All actions can be completed via keyboard",
        priority: "P2",
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
            <p className="text-text-sub font-medium">Steps:</p>
            <ol className="list-decimal list-inside text-text-sub space-y-0.5 pl-1">
              {tc.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <p className="text-text-sub mt-2">
              <span className="font-medium">Expected:</span> {tc.expected}
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
        <h1 className="text-2xl font-bold">QA Checklist</h1>
        <button
          onClick={reset}
          className="text-xs text-text-hint hover:text-text-sub transition-colors px-2 py-1 border border-border rounded"
        >
          Reset
        </button>
      </div>
      <p className="text-text-sub text-sm mb-6">
        Test cases for this prototype. Check state is saved in browser storage.
      </p>

      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-text-sub">Progress</span>
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
