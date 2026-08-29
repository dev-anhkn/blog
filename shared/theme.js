/*
 * Shared Tailwind CSS v4 theme + component classes for dev.anhkn.
 * Loaded on every page right after the @tailwindcss/browser CDN script.
 * The CDN script watches the DOM (MutationObserver) for <style type="text/tailwindcss">
 * blocks, so injecting one here works exactly like writing it inline in <head>.
 * Edit this ONE file to change design tokens or shared component classes site-wide.
 */
document.head.insertAdjacentHTML('beforeend',
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
);

document.head.insertAdjacentHTML('beforeend', `<style type="text/tailwindcss">
  @theme {
    /* Desert Titan — dark theme design tokens */
    --color-surface-0: #110e08;
    --color-surface-1: #1c1710;
    --color-surface-2: #252015;
    --color-text: #ede0c4;
    --color-text-muted: #9c8a6a;
    --color-border: #3e3220;
    --color-amber: #c9872a;
    --color-amber-light: #e5aa58;
    --color-blue: #7699b8;
    --color-green: #7aa86a;
    --color-teal: #5a9a88;
    --color-yellow: #c9a030;
    --color-purple: #a88888;
    --color-red: #c05a40;

    --radius: 12px;
    --radius-chip: 8px;
    --radius-pill: 20px;
    --radius-tag: 4px;

    --shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
    --shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.55);

    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  }

  body { @apply font-sans text-text bg-surface-0 leading-relaxed text-base min-h-screen flex flex-col; }
  a { @apply text-amber no-underline; }
  a:hover { @apply underline text-amber-light; }
  img { @apply max-w-full; }

  /* HEADER / NAV */
  header { @apply bg-surface-1 sticky top-0 z-50 border-b-2 border-amber; }
  nav { @apply max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between; }
  .nav-logo { @apply text-lg font-bold text-text tracking-tight; }
  .nav-logo span { @apply text-amber; }
  .nav-links { @apply flex gap-8 list-none; }
  .nav-links a { @apply text-text-muted text-sm font-medium transition-colors; }
  .nav-links a:hover, .nav-links a.active { @apply text-text no-underline; }
  .nav-links a.active { @apply text-amber; }

  /* CONTAINER */
  .container { @apply max-w-[1200px] mx-auto px-6; }

  /* HERO */
  .hero {
    @apply text-text text-center px-6 py-24;
    background:
      radial-gradient(ellipse 900px 500px at 50% -10%, rgba(201, 135, 42, 0.20), transparent 65%),
      linear-gradient(160deg, var(--color-surface-0), #2a1e0a, #1a1508);
  }
  .hero h1 { @apply text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-tight mb-5 tracking-tight bg-gradient-to-br from-[#f5e8cc] to-amber-light bg-clip-text text-transparent; }
  .hero h1 span { @apply text-amber-light; }
  .hero p { @apply text-lg text-text-muted max-w-[560px] mx-auto mb-9; }

  .btn { @apply inline-flex items-center gap-2 bg-amber text-surface-0 px-7 py-3 rounded-chip font-semibold text-sm transition; }
  .btn:hover { @apply opacity-90 -translate-y-px no-underline; }
  .btn-outline { @apply bg-transparent border-2 border-border text-text-muted ml-3; }
  .btn-outline:hover { @apply border-amber text-amber-light; }

  /* SECTION */
  .section { @apply py-16; }
  .section-title { @apply text-2xl font-bold mb-2 tracking-tight text-text; }
  .section-sub { @apply text-text-muted mb-10; }

  /* CARD GRID */
  .card-grid { @apply grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]; }
  .card { @apply bg-surface-1 border border-border rounded shadow transition-all cursor-pointer flex flex-col p-6 text-text; }
  .card:hover { @apply shadow-hover -translate-y-0.5 border-amber/45 no-underline; }
  .card-day { @apply inline-block bg-amber/14 border border-amber/35 text-amber-light text-xs font-bold px-2.5 py-1 rounded-pill mb-3 tracking-wide uppercase; }
  .card h3 { @apply text-[1.05rem] font-bold mb-2 leading-snug text-text; }
  .card p { @apply text-sm text-text-muted leading-relaxed; }
  .card-meta { @apply flex items-center gap-3 mt-auto pt-4 border-t border-border text-xs text-text-muted; }
  .tag { @apply bg-surface-2 text-text-muted px-2 py-0.5 rounded-tag text-xs font-medium; }

  /* PAGE HEADER */
  .page-header { @apply bg-surface-1 px-6 py-14 text-text border-b border-border; }
  .page-header h1 { @apply text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-br from-[#f5e8cc] to-amber-light bg-clip-text text-transparent; }
  .page-header h1 span { @apply text-amber-light; }
  .page-header p { @apply text-text-muted; }

  /* ARTICLE */
  .article-header { @apply px-6 pt-14 max-w-[760px] mx-auto; }
  .article-day { @apply inline-block bg-amber text-surface-0 text-xs font-bold px-3.5 py-1 rounded-pill mb-4; }
  .article-header h1 { @apply text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold leading-tight tracking-tight mb-3 bg-gradient-to-br from-[#f5e8cc] to-amber-light bg-clip-text text-transparent; }
  .article-header .meta { @apply text-text-muted text-sm mb-8 pb-8 border-b border-border; }
  .article-header .meta a { @apply text-amber; }

  .article-body { @apply max-w-[760px] mx-auto px-6 pt-10 pb-20; }
  .article-body h2 { @apply text-[clamp(1.4rem,3vw,2rem)] font-bold mt-10 mb-4 pb-2 border-b-2 border-amber/14 text-text; }
  .article-body h3 { @apply text-lg font-bold mt-7 mb-2.5 text-text; }

  .article-hero-img { @apply w-full rounded border border-border shadow mb-8 block; }
  .article-hero-img.is-native { @apply w-auto max-w-full mx-auto; }
  .article-task-icon { @apply w-[220px] max-w-full rounded-chip border border-border shadow block mb-4; }

  .article-columns { @apply grid [grid-template-columns:1fr_1fr] gap-6 items-center mb-8; }
  .article-columns img { @apply w-full rounded border border-border shadow block; }
  .article-columns h3 { @apply mt-0; }
  .article-columns p { @apply mb-0; }

  /* LIGHTBOX */
  .lightbox-trigger { @apply block relative cursor-zoom-in; }
  .lightbox-trigger::after { content: "🔍 Bấm để phóng to"; @apply absolute right-3 bottom-3 bg-surface-0/75 text-text text-xs px-2.5 py-1 rounded-pill opacity-0 transition-opacity; }
  .lightbox-trigger:hover::after { @apply opacity-100; }
  .lightbox { @apply hidden target:flex fixed inset-0 z-[999] px-6 py-12 items-center justify-center; }
  .lightbox-backdrop { @apply absolute inset-0 bg-black/88; }
  .lightbox-content { @apply relative max-w-full max-h-full text-center; }
  .lightbox-content img { @apply block max-w-full [max-height:calc(100vh-120px)] rounded border border-border shadow-hover mx-auto; }
  .lightbox-content figcaption { @apply mt-3 text-text-muted text-sm; }

  /* INFO / TASK CARD (accordion) */
  .task-card-grid, .info-card-grid { @apply grid gap-5 my-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]; }
  .task-card, .info-card { @apply bg-surface-1 border border-border rounded p-5 shadow transition-colors; }
  .task-card:hover, .info-card:hover { @apply border-amber/45 shadow-hover; }
  .task-card[open], .info-card[open] { @apply border-amber/35; }
  .task-card summary, .info-card summary { @apply list-none cursor-pointer [&::-webkit-details-marker]:hidden; }
  .task-card-head, .info-card-head { @apply flex items-center gap-3.5; }
  .task-card-icon { @apply w-11 h-auto shrink-0 rounded-tag border border-border transition-[width]; }
  .task-card[open] .task-card-icon { @apply w-[110px]; }
  .task-card h3, .info-card h3 { @apply m-0 flex-1; }
  .info-card-badge { @apply w-[30px] h-[30px] shrink-0 rounded-full bg-amber/14 border border-amber/35 text-amber-light text-sm font-bold flex items-center justify-center; }
  .task-card-toggle, .info-card-toggle { @apply w-[9px] h-[9px] shrink-0 border-r-2 border-b-2 border-amber -rotate-45 transition-transform mr-0.5; }
  .task-card[open] .task-card-toggle, .info-card[open] .info-card-toggle { @apply rotate-45; }
  .task-card-body, .info-card-body { @apply mt-4 pt-4 border-t border-border; }
  .task-card-body p, .info-card-body p { @apply text-sm leading-relaxed mb-2.5; }
  .task-card-body p:last-child, .info-card-body p:last-child { @apply mb-0; }

  /* ARTICLE BODY TEXT */
  .article-body p { @apply mb-6 text-text text-[1.05rem] leading-[1.8]; }
  .article-body p.lead { @apply text-xl leading-relaxed text-text; }
  .article-body strong, .article-body li strong { @apply text-amber-light font-bold; }
  .article-body ul { @apply list-disc mb-5 ml-6 text-text; }
  .article-body ol { @apply list-decimal mb-5 ml-6 text-text; }
  .article-body li { @apply mb-1.5; }
  .article-body pre { @apply bg-surface-2 text-text border border-border px-6 py-5 rounded-chip overflow-x-auto my-5 font-mono text-sm leading-relaxed; }
  .article-body code { @apply font-mono text-sm bg-surface-2 px-1.5 py-0.5 rounded-tag text-amber-light; }
  .article-body pre code { @apply bg-transparent text-inherit p-0; }
  .article-body blockquote { @apply border-l-4 border-amber bg-amber/14 px-5 py-4 rounded-r-chip my-5 text-text; }
  .article-body table { @apply w-full border-collapse my-5 text-sm; }
  .article-body th { @apply bg-surface-2 text-text px-4 py-2.5 text-left border-b-2 border-amber/35; }
  .article-body td { @apply px-4 py-2.5 border-b border-border text-text; }
  .article-body tr:nth-child(even) td { @apply bg-surface-1; }

  /* ARTICLE NAV */
  .article-nav { @apply max-w-[760px] mx-auto px-6 pb-20 flex justify-between gap-4; }
  .article-nav a { @apply flex-1 px-5 py-4 border border-border rounded transition text-sm text-text; }
  .article-nav a:hover { @apply border-amber bg-amber/14 no-underline; }
  .article-nav .nav-label { @apply text-xs text-text-muted block mb-1 uppercase font-semibold tracking-wide; }
  .article-nav .prev { @apply text-left; }
  .article-nav .next { @apply text-right; }

  /* ABOUT */
  .about-grid { @apply grid [grid-template-columns:200px_1fr] gap-12 items-start; }
  .avatar { @apply w-[180px] h-[180px] rounded-full bg-surface-1 flex items-center justify-center text-6xl border-4 border-amber; }
  .about-content h2 { @apply text-3xl font-extrabold mb-1 text-text; }
  .about-content .role { @apply text-amber-light font-semibold mb-5; }
  .about-content p { @apply text-text-muted mb-4; }
  .skills-grid { @apply flex flex-wrap gap-2 mt-6; }
  .skill-tag { @apply bg-surface-2 border border-border text-text px-3.5 py-1.5 rounded-pill text-sm font-medium; }

  /* FOOTER */
  footer { @apply bg-surface-1 text-text-muted text-center px-6 py-8 text-sm mt-auto border-t border-border; }
  footer a { @apply text-amber; }

  /* LABEL */
  .label { @apply text-xs uppercase font-semibold tracking-wide text-text-muted; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .nav-links { @apply gap-5; }
    .about-grid { @apply [grid-template-columns:1fr]; }
    .avatar { @apply mx-auto; }
    .about-content { @apply text-center; }
    .skills-grid { @apply justify-center; }
    .article-nav { @apply flex-col; }
    .article-columns { @apply [grid-template-columns:1fr]; }
  }
</style>`);
