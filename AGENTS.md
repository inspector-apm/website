# Inspector Website

This project contains the static marketing website for inspector.dev, generated with Astro.

The design system is the source of truth for palette, type, voice and components:
https://claude.ai/artifact/XSV4biFTxPUSNB3RYwEg6F

## Design Tokens - ALWAYS use predefined variables

Never use custom/hardcoded values for spacing, radius, colors, shadows, z-index, or layout.
Always use the predefined CSS custom properties from `src/styles/variables/`.

### Spacing (`src/styles/variables/spacing.scss`)
Use `--space-{1-9}`: 4, 8, 12, 16, 24, 32, 48, 64 and 96px.

### Border Radius (`src/styles/variables/radius.scss`)
Use `--radius-sm`, `--radius-md`, `--radius-full`.

### Colors (`src/styles/variables/palette.scss`)
Use the semantic tokens: `--ground`, `--surface`, `--text`, `--text-muted`, `--line`, `--orange`, `--accent-text` and the rest.
Raw hex values live only in `palette.scss`.

Tokens have two themes. Canvas is the default. Set `data-theme="ink"` on a wrapper to switch every token inside it.

### Shadows, Z-Index, Layout
Use `--shadow-card`, `--shadow-menu`, `--z-index-menu`, `--container` and `--measure`.

## Design Rules

- Orange means look here: the primary action or the anomaly in a timeline, and nothing else.
- Put text on `--orange` in `--on-orange`, never white. Use `--accent-text` when orange has to be text.
- Canvas is the application, Ink is the agent.
- A card is the product: cards hold product UI, and marketing copy sits directly on `--ground`.
- Sora is for what people write. JetBrains Mono is only for what a machine prints.
- Rebuild product visuals in HTML from `src/components/product/`. Use no stock images or illustrations.
- Never invent a number, customer, quote or benchmark. Figures in `src/consts/samples.ts` are example data.
- Promise only what ships. AI Bug Fix proposes a fix, and a coding agent connected through the MCP server changes the code.

## Breakpoints - use SCSS mixins

Never write raw `@media` queries for widths. Always use the mixins from `src/styles/mixins/_media.scss`.

```scss
<style lang="scss">
  @use '~styles/mixins/media' as *;

  .element {
    // mobile-first styles
    padding: var(--space-4);

    @include media-min('sm') {
      padding: var(--space-5);
    }
  }
</style>
```

Available breakpoints: `xs` (480px), `sm` (768px), `md` (992px), `lg` (1200px), `xl` (1400px).
Prefer `media-min` (mobile-first). Use `media-max` only when absolutely necessary.

## CSS Class Naming

Use camelCase for CSS class names, not kebab-case.

## Tech Stack

- Astro with TypeScript
- SCSS for styling (scoped `<style lang="scss">`)
- HTML
- Mobile-first responsive approach

## Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
