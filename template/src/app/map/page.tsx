"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { screens, type Screen } from "./screens";
import { ScreenNode } from "./screen-node";
import { ScreenPanel } from "./screen-panel";
import { AlignHorizontalSpaceAround, ZoomIn, ZoomOut } from "lucide-react";

const STORAGE_KEY = "proto-map-positions";
const CARD_W = 280;
const CARD_GAP_X = 160;
const CARD_GAP_Y = 40;

function autoLayout(items: Screen[]): Record<string, { x: number; y: number }> {
  const incoming = new Set<string>();
  for (const s of items) for (const t of s.linksTo ?? []) incoming.add(t);
  const cols = new Map<string, number>();
  const visited = new Set<string>();
  const roots = items.filter((s) => !incoming.has(s.id));
  const queue = roots.map((r) => ({ id: r.id, col: 0 }));
  while (queue.length > 0) {
    const { id, col } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    cols.set(id, col);
    const screen = items.find((s) => s.id === id);
    for (const t of screen?.linksTo ?? []) {
      if (!visited.has(t)) queue.push({ id: t, col: col + 1 });
    }
  }
  for (const s of items) if (!cols.has(s.id)) cols.set(s.id, 0);
  const colGroups = new Map<number, string[]>();
  for (const [id, col] of cols) {
    if (!colGroups.has(col)) colGroups.set(col, []);
    colGroups.get(col)!.push(id);
  }
  const positions: Record<string, { x: number; y: number }> = {};
  for (const [col, ids] of colGroups) {
    const totalH = ids.length * 300 + (ids.length - 1) * CARD_GAP_Y;
    const startY = -totalH / 2;
    ids.forEach((id, i) => {
      positions[id] = { x: col * (CARD_W + CARD_GAP_X), y: startY + i * (300 + CARD_GAP_Y) };
    });
  }
  return positions;
}

function loadPositions(): Record<string, { x: number; y: number }> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function savePositions(nodes: Node[]) {
  const positions: Record<string, { x: number; y: number }> = {};
  for (const n of nodes) positions[n.id] = n.position;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

function buildInitialNodes(items: Screen[]): Node[] {
  const saved = loadPositions();
  const layout = autoLayout(items);
  return items.map((screen) => ({
    id: screen.id,
    type: "screen",
    position: saved?.[screen.id] ?? layout[screen.id] ?? { x: 0, y: 0 },
    data: screen,
  }));
}

function buildEdges(items: Screen[]): Edge[] {
  const edges: Edge[] = [];
  for (const screen of items) {
    for (const targetId of screen.linksTo ?? []) {
      edges.push({
        id: `${screen.id}->${targetId}`,
        source: screen.id,
        target: targetId,
        type: "default",
        animated: true,
        style: { stroke: "#94a3b8", strokeWidth: 2 },
      });
    }
  }
  return edges;
}

function ToolbarButton({ onClick, tooltip, children }: { onClick: () => void; tooltip: string; children: React.ReactNode }) {
  return (
    <div className="relative group/btn">
      <button onClick={onClick} className="w-9 h-9 flex items-center justify-center hover:bg-wf-surface transition-colors text-wf-text-sub hover:text-wf-text">
        {children}
      </button>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = { screen: ScreenNode };

function MapCanvas() {
  const initialNodes = useMemo(() => buildInitialNodes(screens), []);
  const initialEdges = useMemo(() => buildEdges(screens), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [panelScreen, setPanelScreen] = useState<Screen | null>(null);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const handler = (e: Event) => setPanelScreen((e as CustomEvent).detail as Screen);
    window.addEventListener("open-screen-detail", handler);
    return () => window.removeEventListener("open-screen-detail", handler);
  }, []);

  const handleAutoAlign = useCallback(() => {
    const layout = autoLayout(screens);
    setNodes((nds) => nds.map((n) => ({ ...n, position: layout[n.id] ?? n.position })));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
  }, [setNodes, fitView]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          if (changes.some((c) => c.type === "position" && c.dragging === false)) {
            setTimeout(() => savePositions(nodes), 50);
          }
        }}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="#e2e8f0" />
        <Panel position="bottom-left">
          <div className="flex items-center bg-white border border-wf-border rounded-lg shadow-sm">
            <ToolbarButton onClick={() => zoomIn({ duration: 200 })} tooltip="Zoom in"><ZoomIn size={15} /></ToolbarButton>
            <div className="w-px h-5 bg-wf-border" />
            <ToolbarButton onClick={() => zoomOut({ duration: 200 })} tooltip="Zoom out"><ZoomOut size={15} /></ToolbarButton>
            <div className="w-px h-5 bg-wf-border" />
            <ToolbarButton onClick={handleAutoAlign} tooltip="Auto align"><AlignHorizontalSpaceAround size={15} /></ToolbarButton>
          </div>
        </Panel>
      </ReactFlow>
      <ScreenPanel screen={panelScreen} onClose={() => setPanelScreen(null)} />
    </div>
  );
}

export default function MapPage() {
  return (
    <div className="w-full h-full overflow-hidden bg-wf-bg" style={{ minHeight: 0 }}>
      <div className="w-full h-full">
        <ReactFlowProvider><MapCanvas /></ReactFlowProvider>
      </div>
    </div>
  );
}
