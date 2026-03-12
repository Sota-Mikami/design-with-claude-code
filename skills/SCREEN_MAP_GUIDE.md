# Screen Map & States/Variants/Patterns Guide

## Overview

Map view (React Flow) to see all prototype screens at a glance,
with States / Variants / Patterns management per screen.

Built into the template. Just `cp -r` and start using.
The template includes a **Cafe Explorer** sample app with
concrete code examples for States / Variants / Patterns.

## Terminology

| Concept | Who switches it? | Stays in prod? | Query Param | Example |
|---------|-----------------|---------------|-------------|---------|
| **State** | User (in-app UI action) | All stay | `_tab=xxx` | Tab switch, grid/list toggle |
| **Variant** | System (data condition) | All stay | `_v=xxx` | Empty / Loading / Error |
| **Pattern** | Designer (comparing design options) | Only one adopted | `_p=xxx` | Card reviews vs timeline reviews |

### State vs Pattern Judgment Criteria

**Important: If the app has a toggle UI (switch button, tabs, etc.) for it, it's a State, not a Pattern.**

- Grid/list view toggle -> **State** (user actively switches via in-app UI)
- Card reviews vs timeline reviews -> **Pattern** (designer is deciding which approach to take)

Pattern is only for "we're unsure which design direction to go."
Pattern switching happens via Compare panel screenshot links. Do not create in-app toggle UI for patterns.

## Rules

### Screens to include in screens.ts

- **Include**: only screens in the prototype's user flow
- **Exclude**: `/spec`, `/qa`, `/map` (meta pages)

### Pattern definition rules

- **Do not make in-app toggle UI for patterns** (define as State instead)
- Pattern has no app-level toggle. Switch only via Compare panel
- Include the default (baseline) pattern in the `patterns` array
- Reason: to compare all patterns side-by-side in the Compare panel
- Default pattern query can be empty `""` (no `_p=`)
- Handle empty query in code: `pattern.query ? \`\${path}?\${pattern.query}\` : path`
- **`group` field**: when exploring patterns from multiple perspectives, use `group` to categorize
  - Compare panel / Map panel: sections separated by group
  - Map node: combined "N patterns" badge

```ts
// Example: 2 perspectives (detail display x tab structure)
patterns: [
  {
    id: "detail-row-expand",
    label: "Row expand",
    description: "Default. Accordion expand on row click.",
    query: "_tab=activity",
    group: "Detail display",
  },
  {
    id: "detail-side-panel",
    label: "Side panel",
    description: "Panel appears on the right.",
    query: "_tab=activity&_p=detail-side-panel",
    group: "Detail display",
  },
],
```

## File Structure

```
src/app/
├── data.ts                # Sample data (cafe data in template)
├── map/
│   ├── screens.ts          # Screen definitions (central config)
│   ├── page.tsx            # React Flow canvas (h-[calc(100vh-40px)] for explicit height)
│   ├── screen-node.tsx     # Custom node (thumbnail + label)
│   └── screen-panel.tsx    # Right side panel (shared by Map + Compare)
├── proto-nav.tsx           # Nav bar + Compare button + ScreenPanel drawer
├── [screens]/page.tsx      # Read query params
├── spec/page.tsx           # Implementation spec (sample filled in)
└── qa/page.tsx             # QA checklist (sample filled in)
scripts/
└── capture-screens.ts      # Playwright screenshots (hides non-app UI automatically)
public/
└── screenshots/            # Auto-generated images
```

## Steps

### 1. Define screens in screens.ts

The template has sample definitions (cafe list + cafe detail).
Replace the content for new prototypes.

```ts
export const screens: Screen[] = [
  {
    id: "cafe-list",              // Unique ID
    label: "Cafe List",           // Display name
    path: "/",                    // Route path
    states: [
      { id: "grid", label: "Grid view" },                          // Default (no query)
      { id: "list", label: "List view", query: "_tab=list" },      // In-app toggle switches this
    ],
    variants: [
      { id: "empty", label: "No results", query: "_v=empty" },
      { id: "loading", label: "Loading", query: "_v=loading" },
    ],
    // patterns: only define when "unsure which design direction." In-app toggles -> State.
    linksTo: ["cafe-detail"],     // Target IDs (arrows connect these)
  },
];
```

### 2. Read query params in each screen

```tsx
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PageInner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("_tab");
  const variant = searchParams.get("_v");
  const pattern = searchParams.get("_p");

  if (variant === "loading") return <LoadingSkeleton />;
  if (variant === "empty") return <EmptyState />;
  if (pattern === "timeline-review") return <TimelineReviews />;
  if (tab === "list") return <ListView />;
  return <DefaultView />;
}

// useSearchParams() requires Suspense (for static export)
export default function Page() {
  return <Suspense><PageInner /></Suspense>;
}
```

### 3. Capture screenshots

```bash
# With dev server running
npm run capture-screens
# If port is not 3000:
BASE_URL=http://localhost:3002 npx tsx scripts/capture-screens.ts
```

File naming:
- States: `{screenId}--{stateId}.png`
- Variants: `{screenId}--v-{variantId}.png`
- Patterns: `{screenId}--p-{patternId}.png`

**Screenshot rules:**
- Screenshots capture only "what the user actually sees"
- These prototype-only UI elements are hidden automatically before capture:
  - ProtoNav header (Prototype / Map / Spec / QA nav)
  - Next.js dev floating buttons (build indicator etc.)
- Handled by `hideNonAppElements()` in `capture-screens.ts`

### 4. View the map

Visit `/map` -> React Flow canvas:
- Drag nodes to reposition (saved to localStorage)
- `linksTo` arrows show screen transitions
- Click a node -> right panel shows States / Variants / Patterns screenshots
- Panel is resizable (drag left edge, 320px-2400px)
- **Column switcher**: 1/2/3/4/6 column toggle in panel header
  - 1 column: vertical scroll (default)
  - 2+ columns: CSS Grid for side-by-side comparison
  - 3+ columns: compact mode (smaller labels, no descriptions)
  - Selection saved to localStorage
- **Sticky headers**: section names (STATES / VARIANTS / PATTERNS) stay visible while scrolling

**Map page note**: ReactFlow needs explicit parent height. Uses `h-[calc(100vh-40px)]` to fill below NavBar.

### 5. Compare panel (compare from prototype pages)

The **"Compare (N)" button** in the ProtoNav bar (right side) opens a drawer from the right while viewing prototype pages.

- **Same ScreenPanel component** shared with Map node click panel
- Shows States / Variants / Patterns screenshots for the current screen
- **Auto-follows page navigation**: drawer content updates when you navigate to a different screen
- Click a screenshot to navigate to that State / Variant / Pattern
- Hidden on `/map`, `/spec`, `/qa` pages (only shows on prototype pages)

**Information design:**
- Section headers (STATES / VARIANTS / PATTERNS) are most prominent (`text-xs font-bold uppercase`)
- Individual captions (Menu, No reviews, etc.) are subtle below screenshots
- Screenshot corners use `rounded-sm` (4px) for natural screen capture appearance

## Section Color Rules

| Section | Border | Background | Text |
|---------|--------|------------|------|
| States | gray-200 | gray-50 | gray-500 |
| Variants | amber-200 | amber-50 | amber-600 |
| Patterns | violet-200 | violet-50 | violet-600 |

## Notes

- `@xyflow/react` and `playwright` are included in template dependencies
- Use `useStore(zoomSelector)` instead of `useViewport()` to avoid SSR errors
- `.next` cache can corrupt easily; on error: `rm -rf .next && npm run dev`
- When adding screens, update `screens.ts` -> `capture-screens` -> redeploy
- `usePathname()` must be imported from `next/navigation` (not `react`)
