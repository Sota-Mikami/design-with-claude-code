# Vibe Design -- UI Prototyping Skill

## Trigger Words
design / prototype / mockup / UI / wireframe / spec / QA / test cases / handoff

## Workflow

### Step 1: Read DESIGN.md (required, every time)

Read your project's DESIGN.md to load tokens, constraints, and wireframe mode definitions.

### Step 2: Wireframe (Grayscale)

1. Confirm the project is set up:
   - If the user already has a project directory with `package.json`, use it as-is
   - If starting fresh, copy the template:
     ```bash
     cp -r template/ path/to/your-prototype/
     cd path/to/your-prototype/
     rm -rf node_modules && npm install
     ```

   The template includes a **Cafe Explorer sample app**.
   Use it as a reference for States / Variants / Patterns implementation,
   then replace the content with your own.
   Sample files: `data.ts` (mock data), `page.tsx` (list), `cafe/page.tsx` (detail),
   `map/screens.ts` (screen definitions), `spec/page.tsx` (spec), `qa/page.tsx` (QA cases)

2. Build structure using wireframe tokens (`--wf-*`):
   - `--wf-bg`: background
   - `--wf-surface`: cards, sections
   - `--wf-border`: dividers
   - `--wf-text`: body text
   - `--wf-text-sub`: secondary text
   - `--wf-accent`: buttons, emphasis

3. `npm run dev` -> verify in browser

4. Iterate with user until structure/layout/IA is solid

### Step 3: Rich Prototype (Apply Brand Colors)

Once wireframe is approved:

1. Replace `--wf-*` tokens with brand tokens:
   - `--wf-accent` -> `--color-primary`
   - `--wf-bg` -> `--color-bg`
   - `--wf-surface` -> `--color-bg-surface`
   - `--wf-text` -> `--color-text`
   - `--wf-text-sub` -> `--color-text-sub`
   - `--wf-border` -> `--color-border`

2. Adjust component styling

3. Add interactions (hover, transitions, etc.)

### Step 3.5: Screen Map & States/Variants/Patterns

For multi-screen prototypes, set up screen mapping.
Built into the template. See `SCREEN_MAP_GUIDE.md` for details.

1. Define all screens in `src/app/map/screens.ts` (states / variants / patterns / linksTo)
   - **State**: User-triggered mode switches within the app (tabs, view toggles). All remain in production
   - **Variant**: Data-condition displays (loading, empty, error). All remain in production
   - **Pattern**: Design alternative comparisons. Only one is adopted in production. No in-app toggle UI
   - WARNING: If the app has a toggle UI for it (e.g. grid/list toggle), it's a State, not a Pattern
2. Each page reads `_tab`, `_v`, `_p` query params to switch displays
3. `npm run capture-screens` to auto-capture screenshots (ProtoNav and Next.js dev UI are hidden automatically)
4. Visit `/map` for React Flow canvas (click nodes to see all screenshots in a panel)
5. On prototype pages, use the **Compare (N)** button in ProtoNav to open a comparison drawer without leaving the page
   - Shares the same ScreenPanel component as the Map panel
   - Auto-follows page navigation (drawer content updates when you navigate to a different screen)

### Step 4: Output (choose based on use case)

- **Hosting**: Deploy and share URL (GitHub Pages or Docker/Coolify)
- **Figma**: transfer via `generate_figma_design`
- **Canvas**: arrange screens for comparison

### Step 5: Implementation Spec

After prototype approval, write specs on the `/spec` page. See `SPEC_GUIDE.md`.

1. Replace the template Placeholders in `spec/page.tsx` with actual specifications
2. Import prototype components for inline display
3. Fill in these sections:
   - Overview (purpose, user story)
   - Components (list + inline preview)
   - Interaction spec (state transition table)
   - Design tokens (swatches)
   - Responsive behavior
   - Edge cases (error, empty, loading, overflow)
   - Implementation notes (API, types, references)

### Step 6: QA Cases

Generate test scenarios on the `/qa` page. See `SPEC_GUIDE.md`.

1. Replace `templateSections` in `qa/page.tsx` with actual test cases
2. Cover these categories:
   - Basic flow (happy path)
   - Variations (input patterns, devices)
   - Edge cases (boundaries, errors, race conditions)
   - Non-functional (performance, accessibility)
3. Set priority for each case (P0/P1/P2)
4. Checkboxes persist in localStorage for progress tracking

---

## AI Constraints (always follow)

- **ALLOWED**: Tailwind, white background, subtle borders, lucide-react icons
- **PROHIBITED**: gradients, shadow-md or stronger, decorative SVG/illustrations, animated backgrounds, pure black #000
- One screen, one purpose
- Mobile-first
- 8px grid spacing
