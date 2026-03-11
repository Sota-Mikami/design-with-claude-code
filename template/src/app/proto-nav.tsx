"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { screens, type Screen } from "./map/screens";
import { ScreenPanel } from "./map/screen-panel";
import { LayoutGrid } from "lucide-react";

const links = [
  { href: "/", label: "Prototype" },
  { href: "/map", label: "Map" },
  { href: "/spec", label: "Spec" },
  { href: "/qa", label: "QA" },
] as const;

function findScreen(pathname: string): Screen | undefined {
  // Strip basePath prefix if present (for GitHub Pages deployment)
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
  const cleanPath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;

  return (
    screens.find((s) => s.path === cleanPath) ??
    screens
      .filter((s) => cleanPath.startsWith(s.path) && s.path !== "/")
      .sort((a, b) => b.path.length - a.path.length)[0]
  );
}

function ProtoNavInner() {
  const pathname = usePathname();
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
  const cleanPath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;

  const screen = findScreen(pathname);
  const [panelOpen, setPanelOpen] = useState(false);

  // When page changes while panel is open, update panel to show new screen
  useEffect(() => {
    // If navigated to a non-prototype page, close panel
    if (cleanPath.startsWith("/spec") || cleanPath.startsWith("/qa") || cleanPath.startsWith("/map")) {
      setPanelOpen(false);
    }
  }, [cleanPath]);

  const isPrototypePage =
    !cleanPath.startsWith("/spec") &&
    !cleanPath.startsWith("/qa") &&
    !cleanPath.startsWith("/map");

  const panelScreen = panelOpen && screen ? screen : null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-border">
        <div className="mx-auto px-6 flex items-center justify-between h-10">
          {/* Left: nav links */}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? isPrototypePage
                  : cleanPath.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-primary-subtle text-primary font-medium"
                      : "text-text-sub hover:bg-bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: overview button */}
          {isPrototypePage && screen && (() => {
            const viewCount =
              screen.states.length +
              (screen.variants?.length ?? 0) +
              (screen.patterns?.length ?? 0);
            return (
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                  panelScreen
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="全State・Variant・Patternを一覧で見る"
              >
                <LayoutGrid size={12} />
                Compare ({viewCount})
              </button>
            );
          })()}
        </div>
      </nav>

      {/* ScreenPanel drawer */}
      {isPrototypePage && (
        <div className="fixed top-10 right-0 z-[45]" style={{ height: "calc(100vh - 40px)" }}>
          <ScreenPanel screen={panelScreen} onClose={() => setPanelOpen(false)} />
        </div>
      )}
    </>
  );
}

export function ProtoNav() {
  return (
    <Suspense>
      <ProtoNavInner />
    </Suspense>
  );
}
