# Spec & QA Guide

Detailed instructions for SKILL.md Steps 5-6.

---

## Step 5: Implementation Spec

### When to use

After the rich prototype (Step 3) is approved, or when user requests "spec" / "handoff".

### Steps

1. **Open `spec/page.tsx`**
   Replace all Placeholders with actual specifications.

2. **Overview section**
   - Purpose in 1-2 sentences
   - User story: "As a ___, I want to ___, because ___"
   - Target users, prerequisites

3. **Components section**
   - Import prototype components for inline display
   - List Props for each component
   - Component tree (parent-child relationships)

   ```tsx
   // Example: import prototype component
   import { QuizCard } from "@/components/QuizCard";

   <div className="border rounded-lg p-4">
     <p className="text-xs text-text-hint mb-2">QuizCard</p>
     <QuizCard question="Example" choices={["A", "B", "C", "D"]} />
   </div>
   ```

4. **Interaction spec**
   Table format for all state transitions:

   | Element | Trigger | Change | Duration |
   |---------|---------|--------|----------|
   | CTA Button | hover | bg: primary -> primary-hover | 150ms ease |
   | CTA Button | disabled | opacity: 0.5, cursor: not-allowed | -- |

5. **Design tokens**
   - Use `TokenSwatch` component to list actual tokens used
   - Add custom tokens from globals.css if any

6. **Responsive behavior**
   - Changes per breakpoint
   - Especially layout changes (grid columns, hidden elements)

7. **Edge cases**
   Describe specific UI behavior for each state:
   - Error: what message, where displayed
   - Empty: illustration? text? CTA?
   - Loading: skeleton? spinner?
   - Overflow: truncation? scroll? modal?

8. **Implementation notes**
   - API endpoints (method, path, request/response examples)
   - Type definitions (TypeScript interfaces)
   - References to existing codebase components

### Quality checklist

- [ ] All Placeholders replaced with actual specs
- [ ] Inline components render correctly
- [ ] Anchor links work
- [ ] No missing states (error, empty, loading)

---

## Step 6: QA Cases

### When to use

After spec (Step 5) is complete, or when user requests "QA" / "test cases".

### Steps

1. **Open `qa/page.tsx`**
   Replace `templateSections` with actual test cases.

2. **Test case creation principles**
   - Enumerate: normal flow -> variations -> edge cases -> non-functional
   - Set priority for each case:
     - **P0**: Release blocker. Cannot ship if this fails
     - **P1**: Important but has workaround. Fix before first release
     - **P2**: Nice to have. Can wait for next sprint

3. **Basic flow (normal path)**
   - Break down the main user flow step by step
   - Specify expected result for each step
   - Minimum: happy path runs to completion

4. **Variations**
   - Input patterns (min, max, Japanese, emoji, special characters)
   - Device differences (iOS Safari, Android Chrome, desktop)
   - Permission differences (logged in/out, free/premium)

5. **Edge cases**
   - Boundary values (0 items, 1 item, max items, max+1)
   - Errors (network disconnect, server 500, timeout)
   - Race conditions (rapid clicks, double submit, back button)

6. **Non-functional**
   - Performance (initial load, page transitions, scroll)
   - Accessibility (keyboard navigation, screen reader, contrast)
   - Security (XSS input, invalid parameters)

### Test case format

```typescript
{
  id: "basic-1",          // Unique ID (section prefix + number)
  title: "Happy path: submit answer and see result",  // Concise title
  steps: [                // Reproduction steps (be specific)
    "Open quiz screen",
    "Tap choice A",
    "Tap 'Submit' button",
  ],
  expected: "Correct/incorrect feedback is shown, can proceed to next question",
  priority: "P0",         // P0 / P1 / P2
}
```

### Quality checklist

- [ ] At least 3 P0 cases
- [ ] Happy path is fully covered
- [ ] Error cases are included
- [ ] Steps are reproducible by anyone
- [ ] Expected results are verifiable (not "works correctly")
