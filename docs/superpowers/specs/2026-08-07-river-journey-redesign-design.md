# Portfolio redesign: river-journey aesthetic

Date: 2026-08-07
Status: approved

## Goal

Redesign the whole portfolio (currently a dark navy/teal CRA site) to match the visual
language of the reference mockup at `~/Downloads/Portfolio.dc.html` — a warm,
editorial "scene"-based single page — adapted to Amine's real data. The centerpiece is
the Journey section: education and each internship/job shown as separate milestones
strung along a scroll-animated river, instead of the reference's plain dashed line.

Reference mockup is written in a non-runnable pseudo-framework (`x-dc`, `sc-for`,
`sc-if`, `style-hover`) — it is a visual/behavioral spec to translate into the
project's real stack (CRA + styled-components + MUI icons + react-i18next), not code
to port directly.

## Visual system

- Background: warm parchment `#f5efe2`, ink text `#171512`, muted ink
  `rgba(20,18,16,0.5-0.7)` for secondary text.
- Accent: gold/bronze `#9c7a3f` / `#8a6b34` for CTAs, section rules, tags, hover states.
- River accent (journey only): a blue → teal gradient (e.g. `#2f6690 → #3aa6a0`),
  with gold used for the milestone dots so they read against the water and stay
  consistent with the rest of the page's accent language.
- Type: `Space Grotesk` for headings, `Inter` for body copy, `JetBrains Mono` for
  labels/eyebrows/tags/nav — same three Google Fonts as the reference.
- Motifs carried over: fixed top scroll-progress bar, faint grid background, "SCENE
  0N" eyebrows above each section heading, corner-bracket cards for hackathons/
  projects, blinking-cursor logo mark, marquee ticker strip under the hero.
- This replaces the current dark theme site-wide: header, hero, sidebars, footer,
  and every section get restyled — nothing stays in the old navy/teal look.

## Page structure (single page, same anchors as today so old links keep working)

1. **Header** — fixed pill/bar nav restyled to the new palette, same links
   (`#journey`, `#quests`(hackathons), `#stack`, `#work`(projects), `#contact`),
   EN/FR toggle kept.
2. **Hero** — restyled with the reference's word-by-word fade-in title, eyebrow
   line, tagline (existing typewriter hook can stay), two CTAs (`PLAY_JOURNEY`,
   `CONNECT`), profile photo kept small/secondary rather than dropped, since it's
   part of the current identity.
3. **Marquee** — tech keywords ticker, cosmetic, from a small static list.
4. **Journey ("SCENE 01")** — the river. Section spec below.
5. **Quests ("SCENE 02")** — hackathons, restyled as reference's bracket cards,
   fed by existing `hackathons_{lang}.json` (rankings badges, tags, links kept).
6. **Stack ("SCENE 03")** — floating chip cloud, fed by `techStack.json`.
7. **Work ("SCENE 04")** — grid of all 6 projects (not just 1 featured, per
   decision below) as bracket cards: cover-less text card with title, description,
   tags, GitHub link. Fed by `projects_{lang}.json`.
8. **Contact ("SCENE 05")** — restyled, same mailto + GitHub/LinkedIn links.
9. **Footer** — restyled one-liner.
10. Existing `SocialSidebar`, `EmailSidebar`, `ScrollToTop` — restyled to match
    (thin ink/gold styling instead of teal-glow), behavior unchanged.

## Journey / river section — behavior spec

**Data**: one node for education (merging the two `education_{lang}.json` entries —
dual degree, same institution period, shown together) plus one node per entry in
`experience_{lang}.json` (5 nodes: EuroMov, Vaisala, IMT Mines Alès MLOps intern,
Sanofi, GENFIT), each keeping its own description bullets and tech tags. Nodes are
ordered chronologically by start date and alternate left/right down the page, same
as the reference's zigzag layout:

1. Education (Aug 2021 – Aug 2024) — combined dual-degree node
2. EuroMov — Machine Learning Engineer Intern (Jan – Apr 2023)
3. Vaisala — Data Scientist Intern (Apr – Aug 2023)
4. Sanofi — AI Engineer (Sep 2023 – Aug 2024)
5. IMT Mines Alès — MLOps Engineer Intern (Jan – Mar 2024)
6. GENFIT — AI Engineer (Dec 2024 – Present, marked as current/pulsing)

This node list is derived at render time from the existing JSON files (no new data
files to maintain in parallel) plus a small mapping for ordering/side/type-label.

**The river itself**: an SVG path running down the vertical center of the section,
rendered in the blue/teal gradient, replacing the reference's single dashed line
with something that actually reads as water:

- A wide, soft "bank" stroke (low-opacity blue) underneath a narrower bright
  flowing stroke on top, so it has visual depth rather than being a single line.
- The bright stroke uses an animated `stroke-dasharray`/`dashoffset` pattern that
  continuously cycles (CSS `@keyframes`, a few seconds loop) to suggest flowing
  water, independent of scroll.
- On top of that, scroll-linked "reveal": the path's total draw-in is tied to how
  far the section has scrolled into view (`stroke-dashoffset` driven by scroll
  fraction via a scroll listener + `requestAnimationFrame`, mirroring the
  reference's fixed top progress bar), so the river visibly extends as the user
  scrolls down — not just a one-shot IntersectionObserver fade like the reference's
  path draw.
- Milestone dots sit on the path at each node's vertical position, gold-filled,
  with a soft glow; the current job's dot pulses. Each dot connects to its card via
  a short dashed connector, alternating left/right — same mechanic as the
  reference.
- Cards fade/slide in via `IntersectionObserver` per node (kept from the
  reference), independent of the river's own scroll-linked draw animation.

**Implementation approach**: plain SVG + React state + a scroll `requestAnimationFrame`
handler (same pattern the reference mockup itself uses for its progress bar) — no
new animation library. Curve shape is a fixed cubic-bezier path scaled to the
section height via `viewBox`/`preserveAspectRatio`, same technique as the
reference.

## Data flow

- Journey nodes: computed in `Journey.js` from `education_{lang}.json` +
  `experience_{lang}.json` (already fetched per-language) — a small local mapping
  adds `side`/`order`/`type` per known company (matched by name), so no schema
  changes are needed to the JSON files.
- Quests/Stack/Work: same fetch-by-language pattern already used by
  `Hackathons.js`/`TechnicalStack.js`/`Projects.js` today, just restyled.
- i18n: EN/FR is kept. New static UI copy (section eyebrows/headings, nav labels,
  hero words, node type labels like "EDUCATION"/"AI ENGINEERING") goes into
  `src/locales/en.json` / `fr.json` under new keys; data-driven copy continues to
  come from the per-language JSON files as it does today.

## Component plan

- Rework in place (keep filenames/anchors, rewrite internals + styles):
  `Header.js`, `Hero.js`, `Hackathons.js` (→ quest cards), `TechnicalStack.js`
  (→ chip cloud), `Projects.js` (→ work grid), `Contact.js`, `Footer.js`,
  `SocialSidebar.js`, `EmailSidebar.js`, `ScrollToTop.js`.
- Replace `Education.js` + `WorkExperience.js` with a new `Journey.js` that owns
  the river SVG, node layout, and scroll/reveal logic. Old files removed, `App.js`
  updated to render `Journey` under `#journey` instead of separate
  `#work-experience`/`#education` sections (nav links updated to match).
- Add a small `MarqueeTicker.js` for the hero's scrolling keyword strip.
- Remove `About.js` and `AnimatedBackground.js`. The reference design has no
  standalone "about" scene, and About's content (terminal "whoami" block: name,
  title, specialties, stack) is redundant with the new hero (name/title/tagline)
  and Stack section (full tech list) — nothing from it needs to be preserved
  elsewhere. `App.js` drops the `#about` section and its header/nav entry.
- New shared theme constants (colors/fonts) — small `src/theme.js` (or
  styled-components `ThemeProvider`) so the palette isn't copy-pasted across every
  file.
- `index.css`: replace the current dark base styles with the parchment background
  and font-family defaults; add the Google Fonts `<link>` tags to `public/index.html`.

## Responsive behavior

Reference mockup only really addresses desktop (nav collapses to a MENU button
under 860px, but the journey's 3-column grid isn't adapted below that). For this
build: under ~760px the journey collapses to a single column (river becomes a
left-aligned vertical line, all cards left-aligned with the connector removed),
matching the pattern already used elsewhere in the current site's mobile
breakpoints.

## Testing / verification

No existing test coverage for these components beyond CRA's default
`App.test.js` smoke test. Verification is manual: `npm start`, walk through the
page at desktop and mobile widths, confirm river scroll animation, section reveal
animations, EN/FR toggle still switches journey/hackathons/projects data, and all
existing links (mailto, GitHub, LinkedIn, resume download) still work.
