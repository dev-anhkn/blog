# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal engineering blog (dev.anhkn) written in plain HTML/CSS — no build tools, no JS, no framework, no package manager. Content is in Vietnamese (`lang="vi"`). Focus is a series called **"What I Learned From Course Camunda Academy"** (Java + Spring Boot + Camunda 8 Self-managed) — personal notes written after each lesson from the Camunda Academy course, not a fixed-length "30 day challenge". There is no day-count framing (no "Ngày N/30", no "X ngày" language anywhere) — don't reintroduce it.

## Commands

There is no build/lint/test tooling. Preview by opening the HTML files directly in a browser, or serve the directory statically, e.g.:

```
python3 -m http.server 8000
```

Deployment is via the `origin` git remote (`dev-anhkn/blog`) — pushing to it is presumably what publishes the site (e.g. GitHub Pages), so treat pushes to `main` as publishing live content.

## Structure & conventions

- `style.css` at the repo root is the single shared stylesheet for every page. Root pages link it as `style.css`; pages under `camunda/` link it as `../style.css`. There is no per-page or per-section CSS.
- `index.html` (root) is the homepage; `about.html` is the bio page; `camunda/index.html` is the hub/table-of-contents for the Camunda series; article pages live under `camunda/` (e.g. `camunda/overview.html`, `camunda/introduction.html`). Some older files still use a leftover `dayNN.html` name (e.g. `day04.html`, `day06.html`, `day07.html` — none of the three exist as files yet) — that's just a filename, not something to "fix"; new articles can use either a `dayNN.html`-style name or a topic-slug name (preferred, e.g. `overview.html`, `docker-compose.html`).
- Each series is a self-contained top-level folder — the Camunda series lives entirely under `camunda/`: article HTML at `camunda/*.html`, images at `camunda/images/<article-slug>/<file>.png` (one subfolder per article, named after that article's HTML filename, e.g. `camunda/images/bpmn-overview/` holds the images for `camunda/bpmn-overview.html`), and any raw non-HTML source assets (the `.bpmn`/`.dmn` files modeled during the course, not linked from any page) under `camunda/sources/bpmn/` and `camunda/sources/dmn/`. There is no repo-root `images/`, `bpmn/`, or `dmn/` folder anymore — everything Camunda-related was consolidated into `camunda/`. Because images sit alongside the HTML inside `camunda/`, `<img src>` there is just `images/<slug>/<file>` (no `../`) — only `style.css` needs `../` to reach the repo root. When a future series starts (non-Camunda content), give it its own top-level folder following this same shape (`<series>/index.html` hub, `<series>/*.html` articles, `<series>/images/<slug>/`, `<series>/sources/` if needed) rather than growing a shared root-level `images/`.
- Image and asset filenames use kebab-case with no spaces or punctuation (e.g. `how-will-this-task-be-completed.png`, not `How will this task be completed?.png`) so URLs never need `%20`/`%3F` encoding. Rename with `git mv` to preserve history when fixing a non-conforming name.
- Nothing in the rendered page shows a day number or "X/30" — the visible `.article-day` badge on each article page shows a **topic label** instead (e.g. `Architecture`, `Docker`, `Spring Boot`, `Giới thiệu`), matching the `.tag` category already used for that article in the card grid. Article titles are plain topic titles (e.g. "Camunda 8 — Overview"), never prefixed with "Ngày N —".
- The series is organized into topic "Phần" (parts) inside `camunda/index.html` (e.g. "Setup & Architecture", "BPMN Cơ Bản"), each holding a `card-grid` of article entries. There is no day-range subtitle under a part heading (no "Ngày 1–7" etc.) — use a short topic description instead, or omit the subtitle. Entries are **not necessarily contiguous or published in file-number order** — e.g. `overview.html` links to `day04.html` as "next" — this is intentional (content is written incrementally); don't "fix" the gaps or treat links to not-yet-written articles as bugs — check with the user before creating placeholder files for them.
- Unpublished/upcoming cards use `style="opacity:0.5; cursor:default; pointer-events:none;"` (or the dashed-border variant on the homepage) instead of a real link, with the `.card-day` badge reading `Sắp ra mắt` instead of a topic. Follow this pattern for new "coming soon" entries rather than linking to a page that doesn't exist yet.
- Every page repeats the same `<header><nav>` block by hand (logo + Home/Camunda/About links), with `class="active"` on the link matching the current page. When adding a new top-level page, update this nav block in **every** existing HTML file to keep it in sync — there is no shared include/template mechanism.
- Article pages follow a fixed shape: `.article-header` (topic badge, title, date/read-time meta) → `.article-body` (prose, using `.article-body`'s `pre`/`code`/`blockquote`/`table` styles) → `.article-nav` (prev/next links, using the **next article's title**, not a day number — use an empty `<span></span>` on the side that has no neighbor). Match this structure for new articles instead of improvising new layout.
- Listing pages (`index.html`, `camunda/index.html`) use the `.card-grid` / `.card` / `.card-day` / `.tag` component pattern for linking to series and articles. Reuse these classes rather than introducing new ones for similar listings.
- All design tokens (colors, radius, shadows, fonts) are CSS custom properties in `:root` at the top of `style.css`. Use these variables instead of hardcoding colors/values in new CSS — never introduce a new hex color inline.

## Design system — "Desert Titan" dark theme

The site uses a fixed dark theme. Do not add light-mode variants or switch any page back to a white background — every page shares the same dark palette via `style.css`'s `:root` tokens.

- **Surfaces**: `--bg-0` `#110e08` (page background) → `--bg-1` `#1c1710` (cards, header, footer) → `--bg-2` `#252015` (code blocks, table headers, tags) — three-step elevation, darkest at the back.
- **Text**: `--text` `#ede0c4` (body/headings) / `--text-muted` `#9c8a6a` (secondary/meta text). Never pure `#fff`.
- **Border**: `--border` `#3e3220`.
- **Accent (amber)**: `--amber` `#c9872a` / `--amber-light` `#e5aa58`. Overlay helpers: `--amber-wash` (bg tint, alpha 0.12–0.15), `--amber-border` (alpha ~0.35), `--amber-border-hover` (alpha 0.45, used on card hover).
- **Secondary palette** (reserve for category tags / status colors, not yet wired to specific components): `--blue #7699b8`, `--green #7aa86a`, `--teal #5a9a88`, `--yellow #c9a030`, `--purple #a88888`, `--red #c05a40`.
- **Radius**: `--radius` 12px (cards, nav links) / `--radius-chip` 8px (buttons, code blocks, blockquote) / `--radius-pill` 20px (badges) / `--radius-tag` 4px (tags, inline code).
- **Shadow**: `--shadow` / `--shadow-hover`, both `rgba(0,0,0,0.55)`.
- **Font**: Inter (loaded via Google Fonts `@import` at the top of `style.css`) falling back to `system-ui`. Body line-height 1.6.
- **Headings**: H1 (`hero h1`, `.page-header h1`, `.article-header h1`) render as a gradient (`#f5e8cc` → `--amber-light`) via `background-clip: text`; H2 (`.article-body h2`) is `clamp(1.4rem, 3vw, 2rem)` weight 700 with an `--amber-wash` underline.
- **Hero background**: `linear-gradient(160deg, var(--bg-0), #2a1e0a, #1a1508)` plus a radial amber glow (`rgba(201,135,42,0.20)`) at the top.
- **Layout**: `.container`/`nav` max-width 1200px (`--max-width`); `.card-grid` is `repeat(auto-fit, minmax(260px, 1fr))`; `.section` padding is `64px 0`. Article reading columns (`.article-header`/`.article-body`/`.article-nav`) stay narrower at 760px for readability — don't widen those to 1200px.

When adding new components, pull colors/radii/shadows from these tokens rather than hardcoding hex values, so the whole site stays visually consistent with this palette.
