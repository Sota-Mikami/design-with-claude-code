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

4. **Interaction spec**
   Table format for all state transitions:
   | Element | Trigger | Change | Duration |
   |---------|---------|--------|----------|

5. **Design tokens**
   - Use `TokenSwatch` component to list actual tokens used
   - Add custom tokens from globals.css if any

6. **Responsive behavior**
   - Changes per breakpoint
   - Especially layout changes (grid columns, hidden elements)

7. **Edge cases**
   - Error: what message, where displayed
   - Empty: illustration? text? CTA?
   - Loading: skeleton? spinner?
   - Overflow: truncation? scroll? modal?

8. **Implementation notes**
   - API endpoints (method, path, request/response examples)
   - Type definitions (TypeScript interfaces)
   - References to existing codebase components

---

## Step 6: QA Cases

### When to use

After spec (Step 5) is complete, or when user requests "QA" / "test cases".

### Steps

1. **Open `qa/page.tsx`**
   Replace `templateSections` with actual test cases.

2. **Test case format**
   ```typescript
   {
     id: "basic-1",
     title: "Happy path: submit answer and see result",
     steps: [
       "Open quiz screen",
       "Tap choice A",
       "Tap 'Submit' button",
     ],
     expected: "Correct/incorrect feedback is shown, can proceed to next question",
     priority: "P0",
   }
   ```

3. **Categories**
   - **Basic flow**: main user flow step by step (P0)
   - **Variations**: input patterns, device differences, permissions (P1)
   - **Edge cases**: boundaries (0, 1, max, max+1), errors, race conditions (P0-P1)
   - **Non-functional**: performance, accessibility, security (P1-P2)

### Quality checklist

- [ ] At least 3 P0 cases
- [ ] Happy path is fully covered
- [ ] Error cases are included
- [ ] Steps are reproducible by anyone
- [ ] Expected results are verifiable (not "works correctly")
