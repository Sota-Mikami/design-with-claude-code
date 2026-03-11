"use client";

import { Handle, Position, useStore, type NodeProps } from "@xyflow/react";
import type { Screen } from "./screens";
import { getBasePath } from "../base-path";

function screenshotSrc(screenId: string, stateId: string) {
  return `${getBasePath()}/screenshots/${screenId}--${stateId}.png`;
}

const zoomSelector = (s: { transform: [number, number, number] }) =>
  s.transform[2] ?? 1;

export function ScreenNode({ data }: NodeProps) {
  const screen = data as unknown as Screen;
  const stateCount = screen.states.length;
  const variantCount = screen.variants?.length ?? 0;
  const patternGroups = screen.patterns
    ? [...new Set(screen.patterns.map((p) => p.group ?? "Pattern"))]
    : [];
  const zoom = useStore(zoomSelector);

  const labelScale = Math.max(1, 1 / zoom);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("open-screen-detail", { detail: screen })
    );
  };

  return (
    <div className="relative">
      <div
        className="absolute left-0 pointer-events-none"
        style={{
          bottom: "100%",
          transformOrigin: "bottom left",
          transform: `scale(${labelScale})`,
          paddingBottom: 6,
        }}
      >
        {(stateCount > 1 || variantCount > 0 || patternGroups.length > 0) && (
          <div className="flex items-center gap-1.5 mb-1">
            {stateCount > 1 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-wf-surface border border-wf-border text-wf-text-sub whitespace-nowrap">
                {stateCount} states
              </span>
            )}
            {variantCount > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-600 font-medium whitespace-nowrap">
                {variantCount} variants
              </span>
            )}
            {patternGroups.map((g) => {
              const count = screen.patterns!.filter((p) => (p.group ?? "Pattern") === g).length;
              return (
                <span key={g} className="text-[11px] px-1.5 py-0.5 rounded bg-violet-50 border border-violet-200 text-violet-600 font-medium whitespace-nowrap">
                  {g} ({count})
                </span>
              );
            })}
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-wf-text whitespace-nowrap">
            {screen.label}
          </span>
          <span className="text-xs text-wf-text-sub font-mono whitespace-nowrap">
            {screen.path}
          </span>
        </div>
      </div>

      <div
        className="bg-white rounded-md border border-wf-border shadow-md w-[280px] cursor-pointer hover:shadow-lg hover:border-wf-accent/50 transition-all"
        onClick={handleCardClick}
      >
        <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-slate-400 !border-white" />
        <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-slate-400 !border-white" />

        <div className="p-3">
          <div className="rounded-sm border border-wf-border overflow-hidden">
            <div className="aspect-[16/10] bg-wf-surface overflow-hidden">
              <img
                src={screenshotSrc(screen.id, screen.states[0].id)}
                alt={screen.label}
                className="w-full h-full object-cover object-top"
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
