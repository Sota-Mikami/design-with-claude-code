"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { screens, type Screen } from "./map/screens";
import { ChevronDown } from "lucide-react";

const links = [
  { href: "/", label: "Prototype" },
  { href: "/map", label: "Map" },
  { href: "/spec", label: "Spec" },
  { href: "/qa", label: "QA" },
] as const;

function findScreen(pathname: string): Screen | undefined {
  return (
    screens.find((s) => s.path === pathname) ??
    screens
      .filter((s) => pathname.startsWith(s.path) && s.path !== "/")
      .sort((a, b) => b.path.length - a.path.length)[0]
  );
}

type DropdownItem = { label: string; query: string };
type GroupedItem = { groupName: string; items: DropdownItem[] };

function Dropdown({
  label,
  items,
  activeQuery,
  onSelect,
  color,
}: {
  label: string;
  items: DropdownItem[];
  activeQuery: string;
  onSelect: (query: string) => void;
  color: "gray" | "orange" | "violet";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const active = items.find((i) => i.query === activeQuery);
  const colorMap = {
    gray: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    violet: "bg-violet-50 text-violet-600 hover:bg-violet-100",
  };
  const dotMap = { gray: "bg-gray-400", orange: "bg-orange-400", violet: "bg-violet-400" };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${colorMap[color]}`}
      >
        {label}: {active?.label ?? items[0]?.label}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-wf-border rounded-md shadow-lg py-1 z-[60] min-w-[160px]">
          {items.map((item) => (
            <button
              key={item.query}
              onClick={() => { onSelect(item.query); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2 ${
                item.query === activeQuery
                  ? "bg-wf-surface font-medium text-wf-text"
                  : "text-wf-text-sub hover:bg-wf-surface"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotMap[color]}`} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupedPatternDropdown({
  groups,
  activeQuery,
  onSelect,
}: {
  groups: GroupedItem[];
  activeQuery: string;
  onSelect: (query: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allItems = groups.flatMap((g) => g.items);
  const active = allItems.find((i) => i.query === activeQuery);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors bg-violet-50 text-violet-600 hover:bg-violet-100"
      >
        Pattern: {active?.label ?? allItems[0]?.label}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-wf-border rounded-md shadow-lg py-1 z-[60] min-w-[200px] max-h-[400px] overflow-y-auto">
          {groups.map((group, gi) => (
            <div key={group.groupName}>
              {gi > 0 && <div className="border-t border-wf-border my-1" />}
              <div className="px-3 py-1.5 text-[10px] font-bold text-violet-500 uppercase tracking-wider">
                {group.groupName}
              </div>
              {group.items.map((item) => (
                <button
                  key={item.query}
                  onClick={() => { onSelect(item.query); setOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2 ${
                    item.query === activeQuery
                      ? "bg-violet-50 font-medium text-violet-700"
                      : "text-wf-text-sub hover:bg-wf-surface"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProtoNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const screen = findScreen(pathname);
  const currentQuery = searchParams.toString();

  const stateItems: DropdownItem[] =
    screen?.states.map((s) => ({ label: s.label, query: s.query ?? "" })) ?? [];
  const variantItems: DropdownItem[] =
    screen?.variants?.map((v) => ({ label: v.label, query: v.query })) ?? [];

  const handleSelect = (query: string) => {
    if (!screen) return;
    router.push(query ? `${screen.path}?${query}` : screen.path);
  };

  const findActiveQuery = (items: DropdownItem[]) => {
    const matches = items.filter((i) => {
      if (!i.query) return !currentQuery;
      const pairs = i.query.split("&");
      return pairs.every((pair) => currentQuery.includes(pair));
    });
    matches.sort((a, b) => b.query.length - a.query.length);
    return matches[0]?.query ?? items[0]?.query ?? "";
  };

  const patternGroups: GroupedItem[] = [];
  if (screen?.patterns) {
    const seen = new Set<string>();
    for (const p of screen.patterns) {
      const g = p.group ?? "Pattern";
      if (!seen.has(g)) {
        seen.add(g);
        patternGroups.push({
          groupName: g,
          items: screen.patterns
            .filter((x) => (x.group ?? "Pattern") === g)
            .map((x) => ({ label: x.label, query: x.query })),
        });
      }
    }
  }

  const showStates = stateItems.length > 1;
  const showVariants = variantItems.length > 0;
  const showPatterns = patternGroups.length > 0;
  const showSwitcher = showStates || showVariants || showPatterns;

  const isVariantActive = variantItems.some((v) => currentQuery.includes(v.query));

  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-sm border-b border-border">
      <div className="mx-auto px-6 flex items-center justify-between h-10">
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? !pathname.startsWith("/spec") &&
                  !pathname.startsWith("/qa") &&
                  !pathname.startsWith("/map")
                : pathname.startsWith(link.href);
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

        {showSwitcher && (
          <div className="flex items-center gap-1.5">
            {showStates && (
              <Dropdown
                label="State"
                items={stateItems}
                activeQuery={isVariantActive ? stateItems[0]?.query ?? "" : findActiveQuery(stateItems)}
                onSelect={handleSelect}
                color="gray"
              />
            )}
            {showVariants && (
              <Dropdown
                label="Variant"
                items={[{ label: "\u306a\u3057", query: stateItems[0]?.query ?? "" }, ...variantItems]}
                activeQuery={isVariantActive ? findActiveQuery(variantItems) : (stateItems[0]?.query ?? "")}
                onSelect={handleSelect}
                color="orange"
              />
            )}
            {showPatterns && (
              <GroupedPatternDropdown
                groups={patternGroups}
                activeQuery={findActiveQuery(patternGroups.flatMap((g) => g.items))}
                onSelect={handleSelect}
              />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export function ProtoNav() {
  return (
    <Suspense>
      <ProtoNavInner />
    </Suspense>
  );
}
