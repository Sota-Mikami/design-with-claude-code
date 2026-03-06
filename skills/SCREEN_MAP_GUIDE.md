# Screen Map & States/Variants/Patterns Guide

## Overview

Map view (React Flow) to see all prototype screens at a glance,
with States / Variants / Patterns management per screen.

Built into the template. Just `cp -r` and start using.

## Terminology

| Concept | Meaning | Query Param | Example |
|---------|---------|-------------|---------|
| **State** | Display mode (tab switching etc.) | `_tab=xxx` | Overview / Activity |
| **Variant** | Data-condition variations | `_v=xxx` | Empty / Loading |
| **Pattern** | Design alternatives | `_p=xxx` | Option B: Compact |

## Rules

### Screens to include in screens.ts

- **Include**: only screens in the prototype's user flow
- **Exclude**: `/spec`, `/qa`, `/map` (meta pages)

### Pattern definition rules

- Include the default (baseline) pattern in the `patterns` array
- Reason: to compare all patterns side-by-side in the Map panel
- Default pattern query should be empty `""` (no `_p=`)
- Handle empty query in code: `pattern.query ? \`\${path}?\${pattern.query}\` : path`
- **`group` field**: when exploring patterns from multiple perspectives, use `group` to categorize
  - Map panel: sections separated by group
  - ProtoNav: single "Pattern" dropdown with group headers inside
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
  {
    id: "tab-filter",
    label: "Filter chips",
    description: "Add filters to activity tab.",
    query: "_p=tab-filter",
    group: "Tab structure",
  },
],
```

## File Structure

```
src/app/
├── map/
│   ├── screens.ts          # Screen definitions (central config)
│   ├── page.tsx             # React Flow canvas
│   ├── screen-node.tsx      # Custom node (thumbnail + label)
│   └── screen-panel.tsx     # Right side panel (detail view)
├── proto-nav.tsx            # State/Variant/Pattern switching dropdowns
└── [screens]/page.tsx       # Read query params
scripts/
└── capture-screens.ts       # Playwright screenshots
public/
└── screenshots/             # Auto-generated images
```

## Steps

### 1. Define screens in screens.ts

```ts
export const screens: Screen[] = [
  {
    id: "user-detail",
    label: "User Detail",
    path: "/user",
    states: [
      { id: "default", label: "Overview" },
      { id: "activity", label: "Activity", query: "_tab=activity" },
    ],
    variants: [
      { id: "empty", label: "No data", query: "_v=empty" },
    ],
    patterns: [
      { id: "default-expand", label: "A: Expand", description: "Default", query: "_tab=activity" },
      { id: "compact", label: "B: Compact", description: "...", query: "_tab=activity&_p=compact" },
    ],
    linksTo: ["user-edit"],
  },
];
```

### 2. Read query params in each screen

```tsx
const variant = searchParams.get("_v");
const pattern = searchParams.get("_p");

if (variant === "empty") return <EmptyState />;
if (pattern === "compact") return <CompactLayout />;
return <DefaultLayout />;
```

**Important**: Wrap `useSearchParams()` in `<Suspense>` (required for static export).

### 3. Capture screenshots

```bash
# With dev server running
npm run capture-screens
```

File naming:
- States: `{screenId}--{stateId}.png`
- Variants: `{screenId}--v-{variantId}.png`
- Patterns: `{screenId}--p-{patternId}.png`

### 4. View the map

Visit `/map` -> React Flow canvas:
- Drag nodes to reposition (saved to localStorage)
- Arrows show screen transitions
- Click a node -> right panel shows details
- Panel is resizable (drag left edge, 320px-2400px)
- **Column switcher**: 1/2/3/4/6 column toggle in panel header
- **Sticky headers**: section names stay visible while scrolling

### 5. ProtoNav switcher

Automatically appears in the nav bar:
- Matches current `pathname` to `screens.ts`
- Color coding: State=gray / Variant=orange / Pattern=violet
- Variant dropdown auto-adds "None" option at top

## Notes

- `@xyflow/react` and `playwright` are included in template dependencies
- Use `useStore(zoomSelector)` instead of `useViewport()` to avoid SSR errors
- `.next` cache can corrupt easily; stop dev server before large edits. On error: `rm -r .next && npm run dev`
