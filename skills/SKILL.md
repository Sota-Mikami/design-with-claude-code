# Vibe Design -- UI Prototyping Skill

## Trigger Words
design / prototype / mockup / UI / wireframe / spec / QA / test cases / handoff

## Workflow

### Step 1: Read DESIGN.md (required, every time)

Read your project's DESIGN.md to load tokens, constraints, and wireframe mode definitions.

### Step 2: Wireframe (Grayscale)

1. Copy the template:
   ```bash
   cp -r path/to/template/ path/to/your-prototype/
   cd path/to/your-prototype/
   rm -rf node_modules && npm install
   ```

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

For multi-screen prototypes, set up screen mapping. See `SCREEN_MAP_GUIDE.md`.

1. Define all screens in `src/app/map/screens.ts` (states / variants / patterns / linksTo)
2. Each page reads `_tab`, `_v`, `_p` query params to switch displays
3. `npm run capture-screens` to auto-capture screenshots
4. Visit `/map` for React Flow canvas, use ProtoNav bar for State/Variant/Pattern switching

### Step 4: Output (choose based on use case)

- **Hosting**: Docker build -> deploy -> share URL
- **Figma**: transfer via `generate_figma_design`
- **Canvas**: arrange screens for comparison in Pencil

### Step 5: Implementation Spec

After prototype approval, write specs on the `/spec` page. See `SPEC_GUIDE.md`.

Sections:
1. Overview (purpose, user story)
2. Components (list + inline preview)
3. Interaction spec (state transition table)
4. Design tokens (swatches)
5. Responsive behavior
6. Edge cases (error, empty, loading, overflow)
7. Implementation notes (API, types, references)

### Step 6: QA Cases

Generate test scenarios on the `/qa` page. See `SPEC_GUIDE.md`.

Categories:
1. Basic flow (happy path)
2. Variations (input patterns, devices)
3. Edge cases (boundaries, errors, race conditions)
4. Non-functional (performance, accessibility)

Priority levels: P0 (release blocker) / P1 (important) / P2 (nice to have)

---

## AI Constraints (always follow)

- **ALLOWED**: Tailwind, white background, subtle borders, lucide-react icons
- **PROHIBITED**: gradients, shadow-md or stronger, decorative SVG/illustrations, animated backgrounds, pure black #000
- One screen, one purpose
- Mobile-first
- 8px grid spacing
