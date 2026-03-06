"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { X, RectangleVertical, Columns2, Columns3, LayoutGrid, Grid3x3 } from "lucide-react";
import type { Screen, ScreenState, ScreenVariant, ScreenPattern } from "./screens";
import { getBasePath } from "../base-path";

function screenshotSrc(screenId: string, stateId: string) {
  return `${getBasePath()}/screenshots/${screenId}--${stateId}.png`;
}

function variantScreenshotSrc(screenId: string, variantId: string) {
  return `${getBasePath()}/screenshots/${screenId}--v-${variantId}.png`;
}

function patternScreenshotSrc(screenId: string, patternId: string) {
  return `${getBasePath()}/screenshots/${screenId}--p-${patternId}.png`;
}

function ScreenshotCard({
  screenId,
  item,
  path,
  isVariant,
  compact,
}: {
  screenId: string;
  item: ScreenState | ScreenVariant;
  path: string;
  isVariant?: boolean;
  compact?: boolean;
}) {
  const query = item.query ? `?${item.query}` : "";
  const href = `${getBasePath()}${path}${query}`;
  const imgSrc = isVariant
    ? variantScreenshotSrc(screenId, item.id)
    : screenshotSrc(screenId, item.id);

  return (
    <div>
      <div className={`flex items-center gap-1.5 ${compact ? "mb-1" : "mb-2"}`}>
        <span className={`font-medium text-wf-text truncate ${compact ? "text-xs" : "text-sm"}`}>
          {item.label}
        </span>
        {!compact && item.query && (
          <span className="text-[11px] text-wf-text-sub font-mono px-1.5 py-0.5 bg-wf-surface rounded shrink-0">
            ?{item.query}
          </span>
        )}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg border border-wf-border overflow-hidden hover:border-wf-accent hover:shadow-md transition-all"
      >
        <img
          src={imgSrc}
          alt={item.label}
          className="w-full"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </a>
    </div>
  );
}

function PatternCard({
  screenId,
  pattern,
  path,
  compact,
}: {
  screenId: string;
  pattern: ScreenPattern;
  path: string;
  compact?: boolean;
}) {
  const href = pattern.query ? `${getBasePath()}${path}?${pattern.query}` : `${getBasePath()}${path}`;
  const imgSrc = patternScreenshotSrc(screenId, pattern.id);

  return (
    <div>
      <div className={compact ? "mb-1" : "mb-2"}>
        <span className={`font-medium text-wf-text truncate ${compact ? "text-xs" : "text-sm"}`}>
          {pattern.label}
        </span>
      </div>
      {!compact && (
        <p className="text-xs text-wf-text-sub mb-3 leading-relaxed">
          {pattern.description}
        </p>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg border border-wf-border overflow-hidden hover:border-wf-accent hover:shadow-md transition-all"
      >
        <img
          src={imgSrc}
          alt={pattern.label}
          className="w-full"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </a>
    </div>
  );
}

function SectionHeader({
  label,
  sub,
  color,
  level = 1,
}: {
  label: string;
  sub?: string;
  color: "gray" | "orange" | "violet";
  level?: 1 | 2;
}) {
  const styles = {
    gray:   { bg: "bg-gray-50",   border: "border-gray-200", text: "text-gray-500",  subText: "text-gray-400" },
    orange: { bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-600", subText: "text-orange-400" },
    violet: { bg: "bg-violet-50",  border: "border-violet-200", text: "text-violet-600", subText: "text-violet-400" },
  };
  const s = styles[color];
  const isSubGroup = level === 2;

  return (
    <div
      className={`sticky z-10 ${s.bg} border-b ${s.border} shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}
      style={{ top: isSubGroup ? 32 : 0 }}
    >
      <div className={`flex items-center gap-2 ${isSubGroup ? "px-5 py-1.5" : "px-5 py-2"}`}>
        {isSubGroup && <span className={`w-1 h-1 rounded-full ${s.text.replace("text-", "bg-")}`} />}
        <h3 className={`text-[11px] font-bold uppercase tracking-wider ${s.text}`}>
          {label}
        </h3>
        {sub && (
          <span className={`text-[10px] font-normal normal-case ${s.subText}`}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

const COLUMN_OPTIONS = [1, 2, 3, 4, 6] as const;
type ColumnCount = (typeof COLUMN_OPTIONS)[number];
const COL_STORAGE_KEY = "proto-panel-cols";

function loadColumns(): ColumnCount {
  if (typeof window === "undefined") return 1;
  try {
    const v = Number(localStorage.getItem(COL_STORAGE_KEY));
    return COLUMN_OPTIONS.includes(v as ColumnCount) ? (v as ColumnCount) : 1;
  } catch {
    return 1;
  }
}

function ColumnIcon({ cols }: { cols: ColumnCount }) {
  switch (cols) {
    case 1: return <RectangleVertical size={13} />;
    case 2: return <Columns2 size={13} />;
    case 3: return <Columns3 size={13} />;
    case 4: return <LayoutGrid size={13} />;
    case 6: return <Grid3x3 size={13} />;
  }
}

function ColumnSwitcher({
  value,
  onChange,
}: {
  value: ColumnCount;
  onChange: (cols: ColumnCount) => void;
}) {
  return (
    <div className="flex items-center bg-wf-surface rounded-md p-0.5 gap-0.5">
      {COLUMN_OPTIONS.map((cols) => (
        <button
          key={cols}
          onClick={() => onChange(cols)}
          className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
            cols === value
              ? "bg-white text-wf-text shadow-sm"
              : "text-wf-text-sub hover:text-wf-text"
          }`}
          title={`${cols} column${cols > 1 ? "s" : ""}`}
        >
          <ColumnIcon cols={cols} />
        </button>
      ))}
    </div>
  );
}

function CardGrid({
  cols,
  children,
}: {
  cols: ColumnCount;
  children: React.ReactNode;
}) {
  if (cols === 1) {
    return <div className="pt-4 px-5 space-y-5">{children}</div>;
  }
  return (
    <div
      className="pt-4 px-5 gap-4"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

const MIN_WIDTH = 320;
const MAX_WIDTH = 2400;
const DEFAULT_WIDTH = 420;
const STORAGE_KEY = "proto-panel-width";

function loadWidth(): number {
  if (typeof window === "undefined") return DEFAULT_WIDTH;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Number(v))) : DEFAULT_WIDTH;
  } catch {
    return DEFAULT_WIDTH;
  }
}

type Props = {
  screen: Screen | null;
  onClose: () => void;
};

export function ScreenPanel({ screen, onClose }: Props) {
  const [width, setWidth] = useState(loadWidth);
  const [cols, setCols] = useState<ColumnCount>(loadColumns);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const handleColChange = (c: ColumnCount) => {
    setCols(c);
    localStorage.setItem(COL_STORAGE_KEY, String(c));
  };

  const compact = cols >= 3;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      const next = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startW.current + delta));
      setWidth(next);
    };
    const onMouseUp = () => {
      if (dragging.current) {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        localStorage.setItem(STORAGE_KEY, String(width));
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [width]);

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startW.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const patternGroups: { name: string; items: ScreenPattern[] }[] = [];
  if (screen?.patterns) {
    const seen = new Set<string>();
    for (const p of screen.patterns) {
      const g = p.group ?? "";
      if (!seen.has(g)) {
        seen.add(g);
        patternGroups.push({ name: g, items: screen.patterns.filter((x) => (x.group ?? "") === g) });
      }
    }
  }
  const hasGroups = patternGroups.length > 1 || (patternGroups.length === 1 && patternGroups[0].name !== "");
  const hasVariants = screen?.variants && screen.variants.length > 0;
  const hasPatterns = screen?.patterns && screen.patterns.length > 0;

  return (
    <div
      className={`absolute top-0 right-0 h-full z-[50] transition-transform duration-300 ease-in-out ${
        screen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width }}
    >
      <div
        className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize hover:bg-wf-accent/20 active:bg-wf-accent/30 transition-colors z-10"
        onMouseDown={onResizeStart}
      />

      <div className="h-full bg-white border-l border-wf-border shadow-xl flex flex-col">
        {screen && (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-wf-border shrink-0">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-wf-text truncate">
                  {screen.label}
                </h2>
                <span className="text-xs text-wf-text-sub font-mono">
                  {screen.path}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <ColumnSwitcher value={cols} onChange={handleColChange} />
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-wf-surface text-wf-text-sub"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <SectionHeader
                label="States"
                sub={`${screen.states.length} states`}
                color="gray"
              />
              <CardGrid cols={cols}>
                {screen.states.map((state) => (
                  <ScreenshotCard
                    key={state.id}
                    screenId={screen.id}
                    item={state}
                    path={screen.path}
                    compact={compact}
                  />
                ))}
              </CardGrid>
              <div className="h-4" />

              {hasVariants && (
                <>
                  <SectionHeader
                    label="Variants"
                    sub={`${screen.variants!.length} variants`}
                    color="orange"
                  />
                  <CardGrid cols={cols}>
                    {screen.variants!.map((variant) => (
                      <ScreenshotCard
                        key={variant.id}
                        screenId={screen.id}
                        item={variant}
                        path={screen.path}
                        isVariant
                        compact={compact}
                      />
                    ))}
                  </CardGrid>
                  <div className="h-4" />
                </>
              )}

              {hasPatterns && (
                <>
                  <SectionHeader
                    label="Patterns"
                    sub={`${screen.patterns!.length} patterns`}
                    color="violet"
                  />
                  {hasGroups ? (
                    patternGroups.map((group) => (
                      <div key={group.name}>
                        <SectionHeader
                          label={group.name}
                          sub={`${group.items.length}`}
                          color="violet"
                          level={2}
                        />
                        <CardGrid cols={cols}>
                          {group.items.map((pattern) => (
                            <PatternCard
                              key={pattern.id}
                              screenId={screen.id}
                              pattern={pattern}
                              path={screen.path}
                              compact={compact}
                            />
                          ))}
                        </CardGrid>
                        <div className="h-4" />
                      </div>
                    ))
                  ) : (
                    <>
                      <CardGrid cols={cols}>
                        {screen.patterns!.map((pattern) => (
                          <PatternCard
                            key={pattern.id}
                            screenId={screen.id}
                            pattern={pattern}
                            path={screen.path}
                            compact={compact}
                          />
                        ))}
                      </CardGrid>
                      <div className="h-4" />
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
