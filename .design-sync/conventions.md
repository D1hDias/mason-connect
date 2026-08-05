## Mason Connect Design System — build conventions

**No provider or root wrapper is required.** There is no `ThemeProvider`/context — components read Tailwind classes that resolve through CSS custom properties, not React context. The only setup step is loading `styles.css` once (the bound copy's `@import` chain carries the tokens and every component's compiled classes). Skip that import and every component renders as unstyled HTML — no fallback styling exists.

**Styling idiom: Tailwind utility classes from a fixed brand vocabulary — never arbitrary hex values or inline `style`.** No component accepts a `style`, `bg`, or `fg` prop; color always comes from a named semantic `variant`/`tone` prop on the component itself. When composing your own layout glue (spacing, flex containers) around these components, use this vocabulary:

| Concern | Classes |
|---|---|
| Brand colors | `bg-brand-brown` (primary), `bg-brand-gold` (accent), `bg-brand-cream` (page bg), `text-brand-brown`, `text-brand-bronze` (muted text), `border-brand-gold` |
| Surfaces | `bg-surface` (card/white), `border-border` |
| Status tints | `bg-status-{success,warning,critical,neutral,accent}-bg` + matching `text-status-*-fg` — pass these via each component's own `variant`/`tone` prop, don't apply them directly to your own markup |
| Headings | `font-heading` (Georgia serif — headings only; body text uses the default sans stack) |
| Radius | `rounded-lg` (16px, the brand's card radius) — not `rounded-xl`, which is Tailwind's un-tokenized 12px default and off-brand |
| Touch targets | every interactive component already ships `min-h-[44px]`; don't shrink it |

**Mobile-first, not desktop.** There is no sidebar component. `BottomNav` (with `NavTab` children) is the primary navigation pattern — a fixed-height tab bar, meant to sit at the bottom of the viewport. Content components (`Card`, `Stat`, the charts) render full-width/single-column by default; don't wrap them in CSS grid layouts that assume desktop columns.

**Where the truth lives:** read `styles.css` (and its `@import`ed tokens file) before styling anything by hand, and each component's own `.prompt.md`/`.d.ts` for its exact prop shape — those are generated from this same source and are more precise than this summary. `List` and `BottomNav` each bundle a companion sub-component (`ListRow`, `NavTab`) — compose them together rather than styling raw rows/tabs yourself.

**Idiomatic composition example** (adapted from a verified preview):

```jsx
<Card>
  <SectionTitle subtitle="Núcleo Rio de Janeiro">Painel da Gestão</SectionTitle>
  <div className="flex flex-col gap-3">
    <Stat label="Presença média" value="87%" tone="success" />
    <Badge variant="success">Ativo</Badge>
    <Button variant="primary">Entrar no sistema</Button>
  </div>
</Card>
```
