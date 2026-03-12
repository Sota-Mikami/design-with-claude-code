# Design System

プロジェクトのデザイントークンと制約を定義するファイルです。
Claude Code はプロトタイプ作成時にこのファイルを最初に読み込みます。

## Brand Colors

`globals.css` の `@theme` ブロックにカラーが定義されています。
自社のブランドカラーに書き換えてください。

```
Primary:       #5C6AC4（Indigo — サンプル）
Primary Hover: #4F5BB3
Primary Press: #3F4A9E
```

## Design Constraints

- One screen, one purpose（1画面1目的）
- Mobile-first
- 8px grid spacing
- White background, subtle borders
- No gradients, no shadow-md or stronger
- No decorative SVG/illustrations or animated backgrounds
- No pure black (#000) — use `--color-text` (#191919)
- Icons: lucide-react only

## Typography

- Font: System font stack（-apple-system, BlinkMacSystemFont, ...）
- Headings: bold weight, generous line-height
- Body: readability first

## Token Reference

See `src/app/globals.css` for the full token list:
- Colors: `--color-primary`, `--color-bg`, `--color-text`, etc.
- Wireframe: `--wf-bg`, `--wf-surface`, `--wf-accent`, etc.
- Spacing: `--spacing-1` (4px) to `--spacing-10` (40px)
- Radius: `--radius-sm` (4px) to `--radius-full` (9999px)
- Shadows: `--shadow-bottom-100` to `--shadow-bottom-300`
