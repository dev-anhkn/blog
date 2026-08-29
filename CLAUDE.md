# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal engineering blog (dev.anhkn) written in plain HTML — no build tools, no npm, no bundler, no package manager. Styling is **Tailwind CSS v4** loaded at runtime via the browser CDN (see "Styling — Tailwind CSS" below). The only other JS the site ships is two small vanilla-JS files under `shared/` (`shared/theme.js`, `shared/site.js`) that every page loads to avoid duplicating the Tailwind theme block and the header/footer markup — see "Shared includes" below. Content is in Vietnamese (`lang="vi"`). Focus is a series called **"What I Learned From Course Camunda Academy"** (Java + Spring Boot + Camunda 8 Self-managed) — personal notes written after each lesson from the Camunda Academy course, not a fixed-length "30 day challenge". There is no day-count framing (no "Ngày N/30", no "X ngày" language anywhere) — don't reintroduce it.

## Commands

There is no build/lint/test tooling. Preview by opening the HTML files directly in a browser, or serve the directory statically, e.g.:

```
python3 -m http.server 8000
```

Deployment is via the `origin` git remote (`dev-anhkn/blog`) — pushing to it is presumably what publishes the site (e.g. GitHub Pages), so treat pushes to `main` as publishing live content.

## Structure & conventions

- There is no CSS file anywhere in the repo. Every page styles itself via Tailwind CSS v4, loaded through the CDN `<script>` plus one shared `shared/theme.js` include — see "Styling — Tailwind CSS" below before writing or editing any markup.
- `index.html` (root) is the homepage; `about.html` is the bio page; `camunda/index.html` is the hub/table-of-contents for the Camunda series; article pages live under `camunda/` (e.g. `camunda/overview.html`, `camunda/introduction.html`). Some older files still use a leftover `dayNN.html` name (e.g. `day04.html`, `day06.html`, `day07.html` — none of the three exist as files yet) — that's just a filename, not something to "fix"; new articles can use either a `dayNN.html`-style name or a topic-slug name (preferred, e.g. `overview.html`, `docker-compose.html`).
- Each series is a self-contained top-level folder — the Camunda series lives entirely under `camunda/`: article HTML at `camunda/*.html`, images at `camunda/images/<article-slug>/<file>.png` (one subfolder per article, named after that article's HTML filename, e.g. `camunda/images/bpmn-overview/` holds the images for `camunda/bpmn-overview.html`), and any raw non-HTML source assets (the `.bpmn`/`.dmn` files modeled during the course, not linked from any page) under `camunda/sources/bpmn/` and `camunda/sources/dmn/`. There is no repo-root `images/`, `bpmn/`, or `dmn/` folder anymore — everything Camunda-related was consolidated into `camunda/`. Because images sit alongside the HTML inside `camunda/`, `<img src>` there is just `images/<slug>/<file>` (no `../`) — only links back to root pages (`../index.html`, `../about.html`) need `../`. When a future series starts (non-Camunda content), give it its own top-level folder following this same shape (`<series>/index.html` hub, `<series>/*.html` articles, `<series>/images/<slug>/`, `<series>/sources/` if needed) rather than growing a shared root-level `images/`.
- Image and asset filenames use kebab-case with no spaces or punctuation (e.g. `how-will-this-task-be-completed.png`, not `How will this task be completed?.png`) so URLs never need `%20`/`%3F` encoding. Rename with `git mv` to preserve history when fixing a non-conforming name.
- Nothing in the rendered page shows a day number or "X/30" — the visible `.article-day` badge on each article page shows a **topic label** instead (e.g. `Architecture`, `Docker`, `Spring Boot`, `Giới thiệu`), matching the `.tag` category already used for that article in the card grid. Article titles are plain topic titles (e.g. "Camunda 8 — Overview"), never prefixed with "Ngày N —".
- The series is organized into topic "Phần" (parts) inside `camunda/index.html` (e.g. "Setup & Architecture", "BPMN Cơ Bản"), each holding a `card-grid` of article entries. There is no day-range subtitle under a part heading (no "Ngày 1–7" etc.) — use a short topic description instead, or omit the subtitle. Entries are **not necessarily contiguous or published in file-number order** — e.g. `overview.html` links to `day04.html` as "next" — this is intentional (content is written incrementally); don't "fix" the gaps or treat links to not-yet-written articles as bugs — check with the user before creating placeholder files for them.
- Unpublished/upcoming cards use `style="opacity:0.5; cursor:default; pointer-events:none;"` (or the dashed-border variant on the homepage) instead of a real link, with the `.card-day` badge reading `Sắp ra mắt` instead of a topic. Follow this pattern for new "coming soon" entries rather than linking to a page that doesn't exist yet.
- The header/nav and footer are **not** duplicated by hand — every page has a bare `<header id="site-header"></header>` right after `<body>` and a bare `<footer id="site-footer"></footer>` near the end, and a single `<script src="shared/site.js"></script>` (`../shared/site.js` under `camunda/`) placed right before `</body>` fills both in from JS at load time. It figures out Home/Camunda/About active state from `location.pathname`, and whether the logo should render as a plain `<span>` (on the homepage) or a link back to `index.html` (everywhere else). To change nav links, the logo, or the footer markup/copyright line, edit `shared/site.js` **once** — do not add the old inline `<header><nav>...</nav></header>` markup back into a page. A page-specific footer flourish (the homepage's "Built with ☕...") is passed via `data-tagline="..."` on the `<footer>` placeholder rather than duplicating the whole footer.
- Article pages follow a fixed shape: `.article-header` (topic badge, title, date/read-time meta) → `.article-body` (prose, using `.article-body`'s `pre`/`code`/`blockquote`/`table` styles) → `.article-nav` (prev/next links, using the **next article's title**, not a day number — use an empty `<span></span>` on the side that has no neighbor). Match this structure for new articles instead of improvising new layout.
- Listing pages (`index.html`, `camunda/index.html`) use the `.card-grid` / `.card` / `.card-day` / `.tag` component pattern for linking to series and articles. Reuse these classes rather than introducing new ones for similar listings.
- Design tokens (colors, radius, shadows, fonts) live in the `@theme` block of the Tailwind snippet (see below), not in a stylesheet. Use the Tailwind utilities those tokens generate instead of hardcoding colors/values — never introduce a new hex color inline in HTML or in a page's `<style>` block.

## Styling — Tailwind CSS

The whole site is styled with **Tailwind CSS v4**, loaded with zero build step via the official browser CDN. There is no `tailwind.config.js`, no PostCSS, no `npm install` — every page is fully self-contained.

**The canonical block.** Every HTML file's `<head>` ends with this exact pair, immediately before `</head>` (copy it verbatim from any existing page, e.g. `index.html`, when creating a new one):

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<script src="shared/theme.js"></script>
```

(under `camunda/`, the second line is `<script src="../shared/theme.js"></script>`).

- This is the Play/browser CDN build — Tailwind's own docs mark it **"for development only, not production"**. It's used here anyway as a deliberate tradeoff for a no-build personal blog: every page recompiles its utility classes client-side on load (a real, if small, performance cost) in exchange for zero tooling. Don't "fix" this by adding a build step unless the user asks — that would be a bigger architectural change than it looks.
- `shared/theme.js` holds the `@theme` design tokens and every component's `@apply` rule (`.card`, `.hero`, `.article-header`, etc.) as one JS-injected `<style type="text/tailwindcss">` block. This works because the Play CDN script watches the DOM with a `MutationObserver`, so a style tag inserted by JS after page load is picked up and compiled exactly like one written inline — verified empirically, it is not just "should work in theory". **Edit `shared/theme.js` once** to change a token or a shared component rule; do not paste the block back into individual pages.
- Component classes (`.card`, `.hero`, `.article-header`, `.article-body`, `.task-card`/`.info-card` accordions, `.lightbox`, etc.) are still defined with their original semantic names in `shared/theme.js` — each is just a Tailwind `@apply` one-liner now instead of hand-written properties. **Reuse an existing class** the same way the pre-Tailwind conventions said to (see `.card-grid`/`.card`/`.tag` reuse rule above). For a genuinely new one-off bit of UI that won't repeat, prefer plain utility classes directly in the HTML over inventing a new named `@apply` class.
- `<details>`/`<summary>` accordions (`.task-card`, `.info-card`) and the CSS-only lightbox (`.lightbox`, `:target`) still work exactly as before — Tailwind's `open:` variant and arbitrary `target:`/`[&::-webkit-details-marker]:hidden` variants replace what used to be plain `[open]`/`:target`/`::-webkit-details-marker` CSS. No JS was added for either.
- Tailwind's Preflight base reset strips default browser list bullets — `.article-body ul`/`ol` re-enable them explicitly (`list-disc`/`list-decimal`). Keep that in mind if a new component relies on a default browser style; Preflight has likely reset it and it needs an explicit utility.

## Shared includes — `shared/theme.js` and `shared/site.js`

Two hand-written vanilla-JS files at the repo root (`shared/`) are the single source of truth for everything that used to be copy-pasted into every page. Both are loaded relative to the current page (`shared/…` at root, `../shared/…` under `camunda/`), so a new top-level series folder just needs the same `../shared/…` prefix.

- **`shared/theme.js`** — injects the Tailwind `@theme` tokens + all component `@apply` rules into `<head>` (see "Styling — Tailwind CSS" above). Loaded right after the Tailwind CDN `<script>`.
- **`shared/site.js`** — fills in the header/nav and footer. Requires two placeholder elements already in the page: `<header id="site-header"></header>` right after `<body>`, and `<footer id="site-footer"></footer>` near the end; the script tag itself goes right before `</body>` (it needs both elements to already exist in the DOM). It derives the correct relative link prefix from its own `src` attribute, decides the active nav link from `location.pathname` (`/camunda/` anywhere in the path → "Camunda" active; `about.html` → "About" active; else "Home"), and renders the logo as a plain `<span>` on the homepage or a link back to `index.html` everywhere else. A `data-tagline="..."` attribute on the `<footer>` placeholder inserts extra text before the GitHub link for a page that wants a custom footer line (only the homepage uses this today).
- When adding a new page: copy the `<head>` script pair, the `<header id="site-header"></header>` / `<footer id="site-footer"></footer>` placeholders, and the closing `<script src=".../shared/site.js"></script>` from any existing page — don't hand-write nav or footer markup, and don't add a new top-level nav link without also updating the `link(...)` calls inside `shared/site.js`.

## Design system — "Desert Titan" dark theme

The site uses a fixed dark theme. Do not add light-mode variants or switch any page back to a white background — every page shares the same dark palette via the `@theme` tokens in the Tailwind block.

- **Surfaces**: `surface-0` `#110e08` (`bg-surface-0`, page background) → `surface-1` `#1c1710` (cards, header, footer) → `surface-2` `#252015` (code blocks, table headers, tags) — three-step elevation, darkest at the back.
- **Text**: `text` `#ede0c4` (`text-text`, body/headings) / `text-muted` `#9c8a6a` (`text-text-muted`, secondary/meta text). Never pure white (`#fff`/`text-white`).
- **Border**: `border` `#3e3220` (`border-border`).
- **Accent (amber)**: `amber` `#c9872a` / `amber-light` `#e5aa58`. There's no separate "wash"/"border-alpha" token anymore — use Tailwind's opacity modifier directly on the base color: `bg-amber/14` (bg tint, 12–15%), `border-amber/35` (border overlay), `border-amber/45` (hover border, e.g. on card hover).
- **Secondary palette** (reserve for category tags / status colors, not yet wired to specific components): `blue #7699b8`, `green #7aa86a`, `teal #5a9a88`, `yellow #c9a030`, `purple #a88888`, `red #c05a40` — each usable as `bg-blue`, `text-blue`, etc.
- **Radius**: bare `rounded` = 12px (cards, nav links) / `rounded-chip` 8px (buttons, code blocks, blockquote) / `rounded-pill` 20px (badges) / `rounded-tag` 4px (tags, inline code).
- **Shadow**: bare `shadow` / `shadow-hover`, both `rgba(0,0,0,0.55)`.
- **Font**: `font-sans` = Inter (loaded via a Google Fonts `<link rel="stylesheet">` injected by `shared/theme.js` — not a CSS `@import`; an `@import` placed inside the `<style type="text/tailwindcss">` block breaks the Play CDN's compilation of the whole block, silently dropping every token and component class, so don't reintroduce one there — falls back to `system-ui`) and is applied once on `body`, so most elements need no font utility. `font-mono` = `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` for code. Body `leading-relaxed` (~1.6).
- **Headings**: H1s (`hero h1`, `.page-header h1`, `.article-header h1`) render as a gradient (`#f5e8cc` → `amber-light`) via `bg-gradient-to-br from-[#f5e8cc] to-amber-light bg-clip-text text-transparent`; H2 (`.article-body h2`) is `text-[clamp(1.4rem,3vw,2rem)] font-bold` with a `border-amber/14` underline.
- **Hero background**: a plain CSS `background:` declaration (not a utility — arbitrary-value gradients this specific aren't worth forcing into one) combining a radial amber glow with the `linear-gradient(160deg, ...)` base; kept as the one deliberate exception to "utilities only" in `.hero`.
- **Layout**: `.container`/`nav` use `max-w-[1200px] mx-auto`; `.card-grid` is `grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]`; `.section` is `py-16`. Article reading columns (`.article-header`/`.article-body`/`.article-nav`) stay narrower at `max-w-[760px]` for readability — don't widen those to 1200px.

When adding new components, pull colors/radii/shadows from Tailwind utilities generated by these tokens rather than hardcoding hex values or arbitrary one-off colors, so the whole site stays visually consistent with this palette.
