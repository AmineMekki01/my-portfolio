# River-Journey Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dark navy/teal CRA portfolio with the warm cream/gold "scene" aesthetic from `~/Downloads/Portfolio.dc.html`, adapted to Amine Mekki's real data, with education/experience shown as separate milestones strung along a scroll-animated blue/teal river.

**Architecture:** Same stack, restyled top to bottom. A new `src/theme.js` centralizes the color/font constants every component imports. Two new pure-logic modules (`src/utils/journeyNodes.js`, `src/utils/riverPath.js`, `src/utils/scrollMath.js`) carry the only non-trivial logic in the redesign (chronological ordering, tag/bullet extraction, SVG path geometry, scroll-fraction math) and are unit tested. Two small hooks (`useRevealOnScroll`, `useScrollProgress`) wrap that math in DOM effects (IntersectionObserver, scroll listeners) and are exercised manually in-browser, consistent with the rest of the app (no existing test coverage for DOM/visual behavior). Every section component is rewritten in place, same id/anchor it has today except Education+WorkExperience which merge into one new `Journey` component, and Projects moves from `#projects` to `#work` to match the new nav.

**Tech Stack:** React 18 (CRA/react-scripts 5), styled-components, MUI icons/Drawer, react-i18next, Jest + React Testing Library (already configured via react-scripts). No new npm dependencies.

## Global Constraints

- No new npm dependencies — everything ships with `styled-components`, `@mui/*`, `@fortawesome/*`, `react-i18next`, and CRA's built-in Jest setup.
- Keep the EN/FR language toggle working end to end; every new piece of UI copy has both an `en` and `fr` entry in `src/locales/*.json`.
- Palette: background `#f5efe2`, ink text `#171512` (see `src/theme.js` for the full set of tints), gold accent `#9c7a3f`/`#8a6b34`, river gradient `#2f6690 → #3aa6a0`. Fonts: `Space Grotesk` (headings), `Inter` (body), `JetBrains Mono` (labels/mono).
- Section anchors: `#top` (hero), `#journey`, `#quests` (hackathons), `#stack`, `#work` (projects), `#contact` — nav and footer must always point at these.
- `node`/`npm` were not resolvable on PATH in the tool sandbox this plan was written in. Every task's verification step still lists the exact `npm` command to run — whoever executes the task (subagent or the user, e.g. via a `!` shell command in their own terminal) needs a shell where `npm` resolves. If it doesn't, fall back to a manual code read-through and note that in the task's outcome.

---

### Task 1: Fonts, theme constants, base CSS

**Files:**
- Modify: `public/index.html`
- Create: `src/theme.js`
- Modify: `src/index.css`

**Interfaces:**
- Produces: `src/theme.js` exports `colors` (object) and `fonts` (object) — every later task imports `{ colors, fonts } from '../theme'` (components) or `from './theme'` (App.js).

- [ ] **Step 1: Add Google Fonts to the HTML head**

In `public/index.html`, add these three lines right before `<title>Amine MEKKI</title>` (inside `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Also change the existing `<meta name="theme-color" content="#0f0a05" />` line to:

```html
<meta name="theme-color" content="#f5efe2" />
```

- [ ] **Step 2: Create the theme constants file**

Create `src/theme.js`:

```js
export const colors = {
  bg: '#f5efe2',
  bgSoft: 'rgba(156,122,63,0.05)',
  ink: '#171512',
  ink70: 'rgba(20,18,16,0.7)',
  ink65: 'rgba(20,18,16,0.65)',
  ink55: 'rgba(20,18,16,0.55)',
  ink50: 'rgba(20,18,16,0.5)',
  ink45: 'rgba(20,18,16,0.45)',
  ink40: 'rgba(20,18,16,0.4)',
  ink15: 'rgba(20,18,16,0.15)',
  ink10: 'rgba(20,18,16,0.1)',
  ink05: 'rgba(20,18,16,0.05)',
  ink04: 'rgba(20,18,16,0.04)',
  ink02: 'rgba(20,18,16,0.02)',
  gold: '#9c7a3f',
  goldDark: '#8a6b34',
  goldSoft: 'rgba(156,122,63,0.14)',
  goldFaint: 'rgba(156,122,63,0.4)',
  riverDeep: '#2f6690',
  riverBright: '#3aa6a0',
};

export const fonts = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};
```

- [ ] **Step 3: Replace the dark base styles**

Replace the entire contents of `src/index.css` with:

```css
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5efe2;
  color: #171512;
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Space Grotesk', sans-serif;
}

button {
  font-family: inherit;
}

::selection {
  background: rgba(20, 18, 16, 0.12);
}
```

- [ ] **Step 4: Verify manually**

Run `npm start`, open the app. The page background should already be visibly the warm parchment color (even though the old components haven't been restyled yet — the `body` background changed). Open devtools, confirm the `Space Grotesk`/`Inter`/`JetBrains Mono` webfonts load under the Network tab (search "fonts").

- [ ] **Step 5: Commit**

```bash
git add public/index.html src/theme.js src/index.css
git commit -m "feat: add warm-palette theme constants and base styles"
```

---

### Task 2: Full locale content for the new copy

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/fr.json`

**Interfaces:**
- Produces: every `t('...')` key every later task (3 through 14) calls. Defining the complete set now means every later task can be implemented and verified independently, in any order, without missing-key fallbacks showing up in the browser.
- Consumes: nothing.

**Context:** every file in this codebase that currently calls `useTranslation()` (`Header.js`, `Hero.js`, `Education.js`, `WorkExperience.js`, `Hackathons.js`, `TechnicalStack.js`, `Projects.js`, `Contact.js`, `About.js`) is being rewritten or deleted by this plan, so it's safe to fully replace both locale files — nothing outside this plan depends on the old keys.

- [ ] **Step 1: Replace `src/locales/en.json`**

```json
{
  "header": {
    "journey": "Journey",
    "quests": "Quests",
    "stack": "Stack",
    "work": "Work",
    "connect": "Connect",
    "menu": "Menu",
    "resume": "Resume"
  },
  "hero": {
    "name": "Amine MEKKI",
    "eyebrow": "AI ENGINEER · MACHINE LEARNING · AGENTIC SYSTEMS",
    "headline": "Engineering machine learning systems, one agent at a time.",
    "tagline": "AI Engineer at GENFIT, building the machine learning systems, RAG pipelines, and agentic platforms behind production AI. Rooted in a background in biomedical engineering.",
    "ctaPrimary": "PLAY_JOURNEY ▸",
    "ctaSecondary": "CONNECT"
  },
  "heroExtra": {
    "location": "Lille, France"
  },
  "journey": {
    "scene": "SCENE 01",
    "heading": "Building toward AI engineering",
    "subheading": "School, research, and production — a winding road, not a straight line.",
    "educationTitle": "Dual degree: AI/Data Science & Biomedical Engineering",
    "educationDesc": "Engineering degree in Computer Science, AI and Data Science, alongside a Master of Science in Biomedical Engineering — machine learning and deep learning on one side, medical signal processing and imaging on the other.",
    "types": {
      "education": "EDUCATION",
      "euromov-digital-health-in-motion": "RESEARCH",
      "vaisala": "DATA SCIENCE",
      "sanofi": "AI ENGINEERING",
      "ecole-des-mines-ales": "MLOPS",
      "genfit": "AI ENGINEERING"
    }
  },
  "quests": {
    "scene": "SCENE 02",
    "heading": "Hackathons & competitions",
    "subheading": "Detours off the main road — competing against strangers on hard, open ML problems."
  },
  "stack": {
    "scene": "SCENE 03",
    "heading": "The ML & agent stack"
  },
  "work": {
    "scene": "SCENE 04",
    "heading": "Selected work"
  },
  "contact": {
    "scene": "SCENE 05 — FIN",
    "heading": "Let's talk",
    "description": "I'm currently an AI Engineer at GENFIT, building generative AI systems and agentic platforms. Whether you want to discuss AI, MLOps, agentic systems, or an opportunity — feel free to reach out."
  }
}
```

- [ ] **Step 2: Replace `src/locales/fr.json`**

```json
{
  "header": {
    "journey": "Parcours",
    "quests": "Quêtes",
    "stack": "Stack",
    "work": "Travaux",
    "connect": "Contact",
    "menu": "Menu",
    "resume": "CV"
  },
  "hero": {
    "name": "Amine MEKKI",
    "eyebrow": "INGÉNIEUR IA · MACHINE LEARNING · SYSTÈMES AGENTIQUES",
    "headline": "Concevoir des systèmes d'apprentissage automatique, un agent à la fois.",
    "tagline": "Ingénieur IA chez GENFIT, où je construis des systèmes d'apprentissage automatique, des pipelines RAG et des plateformes agentiques derrière l'IA en production. Issu d'une formation en ingénierie biomédicale.",
    "ctaPrimary": "VOIR_PARCOURS ▸",
    "ctaSecondary": "CONTACT"
  },
  "heroExtra": {
    "location": "Lille, France"
  },
  "journey": {
    "scene": "SCÈNE 01",
    "heading": "En route vers l'ingénierie IA",
    "subheading": "École, recherche et production — une route sinueuse, pas une ligne droite.",
    "educationTitle": "Double diplôme : IA/Science des données & Ingénierie biomédicale",
    "educationDesc": "Diplôme d'ingénieur en informatique, IA et science des données, ainsi qu'un Master of Science en ingénierie biomédicale — apprentissage automatique et deep learning d'un côté, traitement du signal et imagerie médicale de l'autre.",
    "types": {
      "education": "FORMATION",
      "euromov-digital-health-in-motion": "RECHERCHE",
      "vaisala": "SCIENCE DES DONNÉES",
      "sanofi": "INGÉNIERIE IA",
      "ecole-des-mines-ales": "MLOPS",
      "genfit": "INGÉNIERIE IA"
    }
  },
  "quests": {
    "scene": "SCÈNE 02",
    "heading": "Hackathons & compétitions",
    "subheading": "Des détours hors de la route principale — en compétition contre des inconnus sur des problèmes ML ouverts et difficiles."
  },
  "stack": {
    "scene": "SCÈNE 03",
    "heading": "La stack ML & agents"
  },
  "work": {
    "scene": "SCÈNE 04",
    "heading": "Projets sélectionnés"
  },
  "contact": {
    "scene": "SCÈNE 05 — FIN",
    "heading": "Discutons",
    "description": "Je suis actuellement ingénieur IA chez GENFIT, où je construis des systèmes d'IA générative et des plateformes agentiques. Que vous souhaitiez discuter d'IA, de MLOps, de systèmes agentiques, ou d'une opportunité — n'hésitez pas à me contacter."
  }
}
```

- [ ] **Step 3: Verify the JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json'))" && node -e "JSON.parse(require('fs').readFileSync('src/locales/fr.json'))"`
Expected: no output (no parse errors) from either command.

- [ ] **Step 4: Commit**

```bash
git add src/locales/en.json src/locales/fr.json
git commit -m "feat: replace locale content for the river-journey redesign"
```

---

### Task 3: Pure logic — scroll math, river path geometry, journey node ordering

**Files:**
- Create: `src/utils/scrollMath.js`
- Create: `src/utils/scrollMath.test.js`
- Create: `src/utils/riverPath.js`
- Create: `src/utils/riverPath.test.js`
- Create: `src/utils/journeyNodes.js`
- Create: `src/utils/journeyNodes.test.js`

**Interfaces:**
- Produces:
  - `computeScrollFraction(scrollY, scrollHeight, viewportHeight) => number` (0–1) — used by `useGlobalScrollProgress` (Task 4).
  - `computeSectionProgress(rectTop, rectHeight, viewportHeight) => number` (0–1) — used by `useSectionScrollProgress` (Task 4).
  - `buildRiverPath(nodeCount) => string` (an SVG `d` path attribute) — used by `RiverPath` (Task 7).
  - `buildJourneyNodes({ education, experience, typeLabels, educationTitle, educationDesc }) => Array<JourneyNode>` where `JourneyNode = { id, side, type, period, title, org, desc, bullets, tags, current }` — used by `Journey` (Task 8).
- Consumes: nothing (pure functions, no imports beyond each other).

- [ ] **Step 1: Write `src/utils/scrollMath.js`**

```js
export function computeScrollFraction(scrollY, scrollHeight, viewportHeight) {
  const max = scrollHeight - viewportHeight;
  if (max <= 0) return 0;
  const fraction = scrollY / max;
  return Math.min(Math.max(fraction, 0), 1);
}

export function computeSectionProgress(rectTop, rectHeight, viewportHeight) {
  const start = viewportHeight * 0.85;
  const end = -rectHeight * 0.9;
  if (start === end) return 0;
  const raw = (start - rectTop) / (start - end);
  return Math.min(Math.max(raw, 0), 1);
}
```

- [ ] **Step 2: Write `src/utils/scrollMath.test.js`**

```js
import { computeScrollFraction, computeSectionProgress } from './scrollMath';

describe('computeScrollFraction', () => {
  test('returns 0 at the top of the page', () => {
    expect(computeScrollFraction(0, 3000, 800)).toBe(0);
  });

  test('returns 1 at the bottom of the page', () => {
    expect(computeScrollFraction(2200, 3000, 800)).toBe(1);
  });

  test('returns a mid fraction halfway down', () => {
    expect(computeScrollFraction(1100, 3000, 800)).toBeCloseTo(0.5);
  });

  test('returns 0 when the page does not scroll (short content)', () => {
    expect(computeScrollFraction(0, 500, 800)).toBe(0);
  });
});

describe('computeSectionProgress', () => {
  const viewportHeight = 800;

  test('is 0 before the section enters the reveal zone', () => {
    expect(computeSectionProgress(2000, 1600, viewportHeight)).toBe(0);
  });

  test('is 1 once the section has scrolled most of the way past', () => {
    expect(computeSectionProgress(-1600, 1600, viewportHeight)).toBe(1);
  });

  test('is a fraction between 0 and 1 while scrolling through the section', () => {
    const progress = computeSectionProgress(200, 1600, viewportHeight);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(1);
  });
});
```

- [ ] **Step 3: Run the scroll math tests**

Run: `CI=true npx react-scripts test src/utils/scrollMath.test.js --watchAll=false`
Expected: PASS, 7 tests.

- [ ] **Step 4: Write `src/utils/riverPath.js`**

```js
export function buildRiverPath(nodeCount) {
  if (nodeCount <= 0) return 'M50,0 L50,100';

  const bandHeight = 100 / nodeCount;
  const points = [];

  for (let i = 0; i < nodeCount; i++) {
    const bandStart = i * bandHeight;
    const bandEnd = bandStart + bandHeight;
    const bendX = i % 2 === 0 ? 82 : 18;
    points.push({ x: bendX, y: bandStart + bandHeight * 0.25 });
    points.push({ x: bendX, y: bandStart + bandHeight * 0.75 });
    points.push({ x: 50, y: bandEnd });
  }

  let d = 'M50,0';
  for (let i = 0; i < points.length; i += 3) {
    const c1 = points[i];
    const c2 = points[i + 1];
    const end = points[i + 2];
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`;
  }
  return d;
}
```

- [ ] **Step 5: Write `src/utils/riverPath.test.js`**

```js
import { buildRiverPath } from './riverPath';

describe('buildRiverPath', () => {
  test('starts at the top center and ends at the bottom center', () => {
    const d = buildRiverPath(3);
    expect(d.startsWith('M50,0')).toBe(true);
    expect(d.trim().endsWith('50,100')).toBe(true);
  });

  test('has one cubic bezier segment per node', () => {
    const d = buildRiverPath(4);
    const segments = d.split('C').length - 1;
    expect(segments).toBe(4);
  });

  test('alternates bend direction between consecutive nodes', () => {
    const d = buildRiverPath(2);
    expect(d).toContain('82,');
    expect(d).toContain('18,');
  });

  test('falls back to a straight line for zero nodes', () => {
    expect(buildRiverPath(0)).toBe('M50,0 L50,100');
  });
});
```

- [ ] **Step 6: Run the river path tests**

Run: `CI=true npx react-scripts test src/utils/riverPath.test.js --watchAll=false`
Expected: PASS, 4 tests.

- [ ] **Step 7: Write `src/utils/journeyNodes.js`**

```js
const EXPERIENCE_ORDER = [
  'EuroMov Digital Health in Motion',
  'Vaisala',
  'Sanofi',
  'Ecole des Mines Alès',
  'GENFIT',
];

const TECH_LINE = /^(tech stack|stack technique)\s*:/i;
const CURRENT_PATTERN = /present|présent/i;

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function buildJourneyNodes({ education, experience, typeLabels, educationTitle, educationDesc }) {
  const educationNode = {
    id: 'education',
    type: typeLabels.education,
    period: education[0] ? education[0].range : '',
    title: educationTitle,
    org: education.map((entry) => entry.institution).join(' · '),
    desc: educationDesc,
    bullets: [],
    tags: Array.from(
      new Set(education.flatMap((entry) => entry.courses.split(',').map((c) => c.trim())))
    ).slice(0, 4),
    current: false,
  };

  const sortedExperience = [...experience].sort(
    (a, b) => EXPERIENCE_ORDER.indexOf(a.company) - EXPERIENCE_ORDER.indexOf(b.company)
  );

  const experienceNodes = sortedExperience.map((job) => {
    const techLine = job.description.find((line) => TECH_LINE.test(line));
    const bullets = job.description.filter((line) => !TECH_LINE.test(line));
    const tags = techLine
      ? techLine.split(':')[1].trim().replace(/\.$/, '').split(',').map((t) => t.trim())
      : [];
    const id = slugify(job.company);

    return {
      id,
      type: typeLabels[id] || job.title,
      period: job.range,
      title: job.title,
      org: `${job.company} · ${job.location}`,
      desc: '',
      bullets,
      tags,
      current: CURRENT_PATTERN.test(job.range),
    };
  });

  return [educationNode, ...experienceNodes].map((node, index) => ({
    ...node,
    side: index % 2 === 0 ? 'left' : 'right',
  }));
}
```

- [ ] **Step 8: Write `src/utils/journeyNodes.test.js`**

```js
import { buildJourneyNodes } from './journeyNodes';

const education = [
  { degree: 'Engineering Degree', institution: 'IMT MINES ALES', range: 'August 2021 - August 2024', courses: 'Machine Learning, Deep Learning' },
  { degree: 'MSc Biomedical Engineering', institution: 'University of Montpellier', range: 'August 2021 - August 2024', courses: 'Medical Imaging, Signal Processing' },
];

const experience = [
  { company: 'GENFIT', title: 'AI ENGINEER', range: 'December 2024 - Present', location: 'Lille, France', description: ['Did A.', 'Did B.', 'Tech Stack : Python, FastAPI.'] },
  { company: 'Sanofi', title: 'AI ENGINEER', range: 'September 2023 - August 2024', location: 'Lyon, France', description: ['Did C.', 'Tech Stack : Python, LangGraph.'] },
  { company: 'Ecole des Mines Alès', title: 'MLOps Engineer - intern', range: 'January - March 2024', location: 'Alès, France', description: ['Did D.', 'Tech Stack : AWS.'] },
  { company: 'Vaisala', title: 'Data Scientist - intern', range: 'April - August 2023', location: 'Saclay, France', description: ['Did E.', 'Tech Stack : Python.'] },
  { company: 'EuroMov Digital Health in Motion', title: 'Machine Learning Engineer - Intern', range: 'January - April 2023', location: 'Montpellier, France', description: ['Did F.', 'Tech Stack : PyTorch.'] },
];

const typeLabels = {
  education: 'EDUCATION',
  genfit: 'AI ENGINEERING',
  sanofi: 'AI ENGINEERING',
  'ecole-des-mines-ales': 'MLOPS',
  vaisala: 'DATA SCIENCE',
  'euromov-digital-health-in-motion': 'RESEARCH',
};

describe('buildJourneyNodes', () => {
  const nodes = buildJourneyNodes({
    education,
    experience,
    typeLabels,
    educationTitle: 'Dual degree',
    educationDesc: 'Two programs at once.',
  });

  test('orders education first, then experience chronologically', () => {
    expect(nodes.map((n) => n.id)).toEqual([
      'education',
      'euromov-digital-health-in-motion',
      'vaisala',
      'sanofi',
      'ecole-des-mines-ales',
      'genfit',
    ]);
  });

  test('alternates sides starting with the education node on the left', () => {
    expect(nodes.map((n) => n.side)).toEqual(['left', 'right', 'left', 'right', 'left', 'right']);
  });

  test('marks only the GENFIT node as current', () => {
    const current = nodes.filter((n) => n.current).map((n) => n.id);
    expect(current).toEqual(['genfit']);
  });

  test('strips the tech-stack line out of bullets and into tags', () => {
    const genfit = nodes.find((n) => n.id === 'genfit');
    expect(genfit.bullets).toEqual(['Did A.', 'Did B.']);
    expect(genfit.tags).toEqual(['Python', 'FastAPI']);
  });

  test('combines both institutions into the education node', () => {
    const educationNode = nodes.find((n) => n.id === 'education');
    expect(educationNode.org).toBe('IMT MINES ALES · University of Montpellier');
    expect(educationNode.tags.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 9: Run the journey node tests**

Run: `CI=true npx react-scripts test src/utils/journeyNodes.test.js --watchAll=false`
Expected: PASS, 5 tests.

- [ ] **Step 10: Commit**

```bash
git add src/utils/scrollMath.js src/utils/scrollMath.test.js src/utils/riverPath.js src/utils/riverPath.test.js src/utils/journeyNodes.js src/utils/journeyNodes.test.js
git commit -m "feat: add pure scroll-math, river-path, and journey-node logic with tests"
```

---

### Task 4: Shared hooks — scroll reveal and scroll progress

**Files:**
- Create: `src/hooks/useRevealOnScroll.js`
- Create: `src/hooks/useScrollProgress.js`

**Interfaces:**
- Consumes: `computeScrollFraction`, `computeSectionProgress` from `../utils/scrollMath` (Task 3).
- Produces:
  - `useRevealOnScroll(threshold = 0.15) => [ref, visible]` — used by `JourneyNode` (Task 8), `Hackathons` (Task 9), `ProjectCard` (Task 11).
  - `useGlobalScrollProgress() => number` (0–1) — used by `App.js` (Task 14) for the fixed top progress bar.
  - `useSectionScrollProgress(sectionRef) => number` (0–1) — used by `Journey` (Task 8) to drive the river's scroll-linked reveal.

- [ ] **Step 1: Write `src/hooks/useRevealOnScroll.js`**

```js
import { useEffect, useRef, useState } from 'react';

export function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
```

- [ ] **Step 2: Write `src/hooks/useScrollProgress.js`**

```js
import { useEffect, useRef, useState } from 'react';
import { computeScrollFraction, computeSectionProgress } from '../utils/scrollMath';

export function useGlobalScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        setProgress(computeScrollFraction(window.scrollY, scrollHeight, window.innerHeight));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

export function useSectionScrollProgress(sectionRef) {
  const [progress, setProgress] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          setProgress(computeSectionProgress(rect.top, rect.height, window.innerHeight));
        }
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionRef]);

  return progress;
}
```

- [ ] **Step 3: Verify**

These hooks have no consumers yet (that comes in Tasks 8 and 14), so there's nothing to see in the browser yet. Confirm the existing test suite still passes with the new files present:

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: PASS (same tests as Task 3, no new failures).

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useRevealOnScroll.js src/hooks/useScrollProgress.js
git commit -m "feat: add scroll-reveal and scroll-progress hooks"
```

---

### Task 5: Header

**Files:**
- Modify: `src/components/Header.js`

**Interfaces:**
- Consumes: `colors`, `fonts` from `../theme` (Task 1); locale keys `header.*` (Task 2).
- Produces: nothing new consumed elsewhere (App.js just renders `<Header />` unchanged).

- [ ] **Step 1: Replace `src/components/Header.js`**

```jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, List, useMediaQuery } from '@mui/material';
import styled from 'styled-components';
import { colors, fonts } from '../theme';

const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 1px solid ${colors.ink10};
  background: rgba(245, 239, 226, ${({ $scrolled }) => ($scrolled ? 0.92 : 0.75)});
  backdrop-filter: blur(10px);
  transition: background 0.3s ease;

  @media (max-width: 700px) {
    padding: 16px 20px;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${colors.ink};
  text-decoration: none;
  letter-spacing: 1px;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${colors.gold};
  display: inline-block;
  animation: recPulse 1.6s ease-in-out infinite;

  @keyframes recPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.85); }
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 26px;
  align-items: center;

  @media (max-width: 860px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${colors.ink65};
  text-decoration: none;
  font-size: 13px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.ink};
  }
`;

const LangButton = styled.button`
  background: none;
  border: 1px solid ${({ $active }) => ($active ? colors.gold : colors.ink15)};
  color: ${({ $active }) => ($active ? colors.ink : colors.ink50)};
  font-family: ${fonts.mono};
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 2px;
  cursor: pointer;
`;

const ConnectLink = styled.a`
  color: ${colors.bg};
  background: ${colors.ink};
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 2px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: background 0.2s ease;

  &:hover {
    background: #3a352e;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: 1px solid ${colors.ink15};
  color: ${colors.ink};
  border-radius: 2px;
  padding: 8px 12px;
  font-size: 12px;
  font-family: ${fonts.mono};
  cursor: pointer;

  @media (max-width: 860px) {
    display: block;
  }
`;

const CustomDrawer = styled(Drawer)`
  .MuiPaper-root {
    background-color: ${colors.bg} !important;
    width: 100% !important;
    padding: 40px;
  }
`;

const MobileLink = styled.a`
  display: block;
  color: ${colors.ink};
  text-decoration: none;
  font-size: 24px;
  font-family: ${fonts.display};
  margin-bottom: 28px;
  cursor: pointer;
`;

const LangRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const NAV_ITEMS = [
  { key: 'journey', href: '#journey' },
  { key: 'quests', href: '#quests' },
  { key: 'stack', href: '#stack' },
  { key: 'work', href: '#work' },
];

const Header = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 860px)');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const closeAndScroll = (href) => {
    setDrawerOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return (
    <HeaderBar $scrolled={scrolled}>
      <Logo href="#top">
        <Dot />
        A_MEKKI
      </Logo>

      <DesktopNav>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.key} href={item.href}>
            {t(`header.${item.key}`)}
          </NavLink>
        ))}
        <LangButton $active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>EN</LangButton>
        <LangButton $active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')}>FR</LangButton>
        <ConnectLink href="#contact">{t('header.connect')}</ConnectLink>
      </DesktopNav>

      {isSmallScreen && (
        <MobileMenuButton onClick={() => setDrawerOpen(true)} aria-label={t('header.menu')}>
          {t('header.menu')}
        </MobileMenuButton>
      )}

      <CustomDrawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {NAV_ITEMS.map((item) => (
            <MobileLink key={item.key} onClick={() => closeAndScroll(item.href)}>
              {t(`header.${item.key}`)}
            </MobileLink>
          ))}
          <MobileLink onClick={() => closeAndScroll('#contact')} style={{ color: colors.gold }}>
            {t('header.connect')}
          </MobileLink>
        </List>
        <LangRow>
          <LangButton $active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>EN</LangButton>
          <LangButton $active={i18n.language === 'fr'} onClick={() => changeLanguage('fr')}>FR</LangButton>
        </LangRow>
      </CustomDrawer>
    </HeaderBar>
  );
};

export default Header;
```

- [ ] **Step 2: Verify manually**

Run `npm start`. Confirm: the header is a translucent parchment bar with the pulsing gold dot logo, nav links read JOURNEY / QUESTS / STACK / WORK (targets don't exist as sections yet — that's expected until Tasks 8–11 land, clicking them is a no-op for now), EN/FR buttons switch the nav language, and CONNECT is a solid dark pill. Resize below 860px and confirm the nav collapses to a MENU button that opens a full-screen drawer.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.js
git commit -m "feat: restyle Header to the parchment/gold theme"
```

---

### Task 6: Hero and marquee ticker

**Files:**
- Create: `src/components/MarqueeTicker.js`
- Modify: `src/components/Hero.js`

**Interfaces:**
- Consumes: `colors`, `fonts` (Task 1); locale keys `hero.*`, `heroExtra.location`, `header.resume` (Task 2); existing `useTypewriter` hook (`src/hooks/useTypewriter.js`, unchanged).
- Produces: `MarqueeTicker` default export, a self-contained component with no props, rendered directly under `<Hero />` in `App.js` (Task 14).

- [ ] **Step 1: Write `src/components/MarqueeTicker.js`**

```jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, fonts } from '../theme';

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const Track = styled.div`
  border-top: 1px solid ${colors.ink10};
  border-bottom: 1px solid ${colors.ink10};
  padding: 16px 0;
  overflow: hidden;
  white-space: nowrap;
  background: ${colors.bgSoft};
`;

const Scroller = styled.div`
  display: inline-block;
  animation: ${marquee} 26s linear infinite;
`;

const Item = styled.span`
  font-family: ${fonts.mono};
  font-size: 14px;
  letter-spacing: 1.5px;
  color: ${colors.ink50};
  padding: 0 20px;

  span {
    color: ${colors.gold};
  }
`;

const ITEMS = [
  'MACHINE LEARNING', 'RAG PIPELINES', 'LANGGRAPH AGENTS', 'MLOPS',
  'LLMS', 'KUBERNETES', 'VECTOR SEARCH', 'GENERATIVE AI',
];

const MarqueeTicker = () => (
  <Track>
    <Scroller>
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <Item key={i}>{item} <span>/</span></Item>
      ))}
    </Scroller>
  </Track>
);

export default MarqueeTicker;
```

- [ ] **Step 2: Replace `src/components/Hero.js`**

```jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useTypewriter } from '../hooks/useTypewriter';
import { colors, fonts } from '../theme';

const fadeUpWord = keyframes`
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 120px 48px 60px;
  max-width: 1060px;
  margin: 0 auto;
`;

const IdentityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${colors.ink15};
`;

const IdentityText = styled.div`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.ink50};

  strong {
    color: ${colors.ink};
    font-weight: 600;
  }
`;

const Eyebrow = styled.div`
  font-size: 13px;
  letter-spacing: 2px;
  color: ${colors.gold};
  margin-bottom: 20px;
  font-weight: 600;
  font-family: ${fonts.mono};
`;

const Headline = styled.h1`
  font-family: ${fonts.display};
  font-size: clamp(2.4rem, 6vw, 4.75rem);
  line-height: 1.08;
  font-weight: 600;
  margin: 0 0 28px 0;
  color: ${colors.ink};
  max-width: 940px;
`;

const Word = styled.span`
  display: inline-block;
  margin-right: 12px;
  animation: ${fadeUpWord} 0.7s ease both;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const Tagline = styled.p`
  font-size: 18px;
  line-height: 1.65;
  color: ${colors.ink65};
  max-width: 640px;
  margin: 0 0 36px 0;
  min-height: 3.2em;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: ${colors.gold};
  margin-left: 3px;
  vertical-align: text-bottom;
  animation: ${blink} 1s step-end infinite;
`;

const CtaRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 36px;
`;

const PrimaryCta = styled.a`
  background: ${colors.ink};
  color: ${colors.bg};
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 26px;
  border-radius: 2px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: background 0.2s ease;

  &:hover {
    background: #3a352e;
  }
`;

const SecondaryCta = styled.a`
  border: 1px solid ${colors.ink15};
  color: ${colors.ink};
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 14px 26px;
  border-radius: 2px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${colors.gold};
    color: ${colors.gold};
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const SocialLink = styled.a`
  color: ${colors.ink50};
  font-size: 18px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.gold};
  }
`;

const Hero = () => {
  const { t, i18n } = useTranslation();
  const tagline = useTypewriter(t('hero.tagline'), 12, 900);
  const resumeLink = i18n.language === 'fr' ? '/resume_amine_mekki_fr.pdf' : '/resume_amine_mekki_en.pdf';
  const resumeDownloadName = i18n.language === 'fr' ? 'Amine_MEKKI_Resume_French.pdf' : 'Amine_MEKKI_Resume_English.pdf';
  const words = t('hero.headline').split(' ');

  return (
    <HeroSection id="top">
      <IdentityRow>
        <Avatar src="./images/me_in_grad.jpg" alt={t('hero.name')} />
        <IdentityText>
          <strong>{t('hero.name')}</strong> · {t('heroExtra.location')}
        </IdentityText>
      </IdentityRow>

      <Eyebrow>{t('hero.eyebrow')}</Eyebrow>

      <Headline>
        {words.map((word, i) => (
          <Word key={`${word}-${i}`} $delay={0.15 + i * 0.06}>{word}</Word>
        ))}
      </Headline>

      <Tagline>
        {tagline}
        <Cursor />
      </Tagline>

      <CtaRow>
        <PrimaryCta href="#journey">{t('hero.ctaPrimary')}</PrimaryCta>
        <SecondaryCta href="#contact">{t('hero.ctaSecondary')}</SecondaryCta>
      </CtaRow>

      <SocialRow>
        <SocialLink href="https://linkedin.com/in/mekki-amine" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} />
        </SocialLink>
        <SocialLink href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FontAwesomeIcon icon={faGithub} />
        </SocialLink>
        <SocialLink href="mailto:amine.mekki.contact@gmail.com" aria-label="Email">
          <FontAwesomeIcon icon={faEnvelope} />
        </SocialLink>
        <SocialLink href={resumeLink} download={resumeDownloadName} aria-label={t('header.resume')}>
          <FontAwesomeIcon icon={faFileAlt} />
        </SocialLink>
      </SocialRow>
    </HeroSection>
  );
};

export default Hero;
```

- [ ] **Step 3: Verify manually**

Run `npm start`. Confirm: the hero headline fades in word by word on load, the tagline paragraph types itself out with a blinking cursor, PLAY_JOURNEY and CONNECT buttons are visible (they won't scroll anywhere useful until Tasks 8 and 12 add those sections), and the social/resume icon row at the bottom works (GitHub/LinkedIn open in a new tab, resume downloads). Toggling EN/FR in the header changes the eyebrow, headline, and tagline text.

- [ ] **Step 4: Commit**

```bash
git add src/components/MarqueeTicker.js src/components/Hero.js
git commit -m "feat: restyle Hero and add the marquee ticker"
```

---

### Task 7: River SVG component

**Files:**
- Create: `src/components/RiverPath.js`

**Interfaces:**
- Consumes: `colors` (Task 1); `buildRiverPath` from `../utils/riverPath` (Task 3, already tested).
- Produces: `RiverPath` default export, props `{ nodeCount: number, progress: number }` (0–1) — used by `Journey` (Task 8).

- [ ] **Step 1: Write `src/components/RiverPath.js`**

```jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../theme';
import { buildRiverPath } from '../utils/riverPath';

const flow = keyframes`
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -120; }
`;

const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 100%;
  pointer-events: none;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const RevealClip = styled.div`
  position: absolute;
  inset: 0;
  clip-path: inset(0 0 ${({ $hiddenPct }) => $hiddenPct}% 0);
`;

const FlowPath = styled.path`
  animation: ${flow} 4s linear infinite;
`;

const RiverPath = ({ nodeCount, progress }) => {
  const d = buildRiverPath(nodeCount);
  const hiddenPct = Math.round((1 - progress) * 100);

  return (
    <Wrap>
      <Svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={d} fill="none" stroke={colors.riverDeep} strokeOpacity="0.18" strokeWidth="7" strokeLinecap="round" />
      </Svg>
      <RevealClip $hiddenPct={hiddenPct}>
        <Svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.riverDeep} />
              <stop offset="100%" stopColor={colors.riverBright} />
            </linearGradient>
          </defs>
          <FlowPath d={d} fill="none" stroke="url(#riverGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
        </Svg>
      </RevealClip>
    </Wrap>
  );
};

export default RiverPath;
```

- [ ] **Step 2: Verify**

`RiverPath` has no consumer yet (that's Task 8). Confirm it at least compiles cleanly:

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: PASS, no new failures (this only exercises the existing Jest suite, not `RiverPath` directly — full visual verification happens in Task 8's manual check once it's actually rendered).

- [ ] **Step 3: Commit**

```bash
git add src/components/RiverPath.js
git commit -m "feat: add the scroll-linked river SVG component"
```

---

### Task 8: Journey section (education + experience river)

**Files:**
- Create: `src/components/JourneyNode.js`
- Create: `src/components/Journey.js`
- Modify: `src/components/LoadingSkeleton.js`
- Delete: `src/components/Education.js`
- Delete: `src/components/WorkExperience.js`

**Interfaces:**
- Consumes: `colors`, `fonts` (Task 1); locale keys `journey.*` (Task 2); `buildJourneyNodes` (Task 3); `useRevealOnScroll`, `useSectionScrollProgress` (Task 4); `RiverPath` (Task 7); `SkeletonBase` (existing, recolored in this task).
- Produces: `Journey` default export (section `id="journey"`, no props) — rendered in `App.js` in place of `<Education />` + `<WorkExperience />` (Task 14).

**Context:** `LoadingSkeleton.js`'s `SkeletonBase` currently uses dark-theme gradient colors (`#2a2724`/`#3d3833`) left over from the navy theme. This task fixes that (shared by `HackathonSkeleton` and `ProjectSkeleton` too, used in Tasks 9 and 11 — no further changes needed there), removes `EducationSkeleton`/`WorkExperienceSkeleton` (only used by the two files this task deletes), and adds `JourneySkeleton`.

- [ ] **Step 1: Update `src/components/LoadingSkeleton.js`**

Replace the whole file:

```jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, rgba(20,18,16,0.05) 25%, rgba(20,18,16,0.1) 50%, rgba(20,18,16,0.05) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const SkeletonCard = styled.div`
  background-color: rgba(20,18,16,0.02);
  border: 1px solid rgba(20,18,16,0.15);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 300px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 24px;
  width: 60%;
`;

const SkeletonLine = styled(SkeletonBase)`
  height: 16px;
  width: ${({ width }) => width || '100%'};
`;

const SkeletonBadge = styled(SkeletonBase)`
  height: 28px;
  width: 80px;
  border-radius: 20px;
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const HackathonSkeleton = () => (
  <SkeletonCard>
    <SkeletonTitle />
    <SkeletonRow>
      <SkeletonBadge />
      <SkeletonBadge />
      <SkeletonBadge />
    </SkeletonRow>
    <SkeletonLine width="80%" />
    <SkeletonLine width="60%" />
    <SkeletonLine width="40%" />
  </SkeletonCard>
);

export const ProjectSkeleton = () => (
  <SkeletonCard style={{ minHeight: '260px' }}>
    <SkeletonTitle />
    <SkeletonLine width="90%" />
    <SkeletonLine width="70%" />
    <SkeletonRow>
      <SkeletonBadge />
      <SkeletonBadge />
      <SkeletonBadge />
    </SkeletonRow>
  </SkeletonCard>
);

export const JourneySkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
    {[...Array(4)].map((_, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
        <SkeletonBase style={{ height: '160px', width: '45%', borderRadius: '8px' }} />
      </div>
    ))}
  </div>
);
```

- [ ] **Step 2: Write `src/components/JourneyNode.js`**

```jsx
import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../theme';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

const Row = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 130px 1fr;
  margin-bottom: 64px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(28px)')};
  transition: opacity 0.7s ease, transform 0.7s ease;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    padding-left: 40px;
    border-left: 2px dashed ${colors.ink15};
    margin-bottom: 48px;
  }
`;

const Dot = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ $current }) => ($current ? colors.gold : colors.bg)};
  border: 2px solid ${colors.gold};
  box-shadow: 0 0 0 5px ${colors.bg}, 0 0 12px rgba(156, 122, 63, 0.45);
  animation: ${({ $current }) => ($current ? 'journeyPulse 1.8s ease-in-out infinite' : 'none')};

  @keyframes journeyPulse {
    0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.6; transform: translateX(-50%) scale(0.85); }
  }

  @media (max-width: 760px) {
    left: -41px;
    transform: none;
  }
`;

const Connector = styled.div`
  position: absolute;
  top: 16px;
  ${({ $side }) => ($side === 'left' ? 'right' : 'left')}: calc(50% + 22px);
  width: ${({ $visible }) => ($visible ? '28px' : '0px')};
  height: 1px;
  border-top: 2px dashed rgba(156, 122, 63, 0.5);
  transition: width 0.6s ease 0.15s;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Card = styled.div`
  position: relative;
  grid-column: ${({ $side }) => ($side === 'left' ? 1 : 3)};
  text-align: ${({ $side }) => ($side === 'left' ? 'right' : 'left')};
  ${({ $side }) => ($side === 'left' ? 'padding-right: 14px;' : 'padding-left: 14px;')}

  @media (max-width: 760px) {
    grid-column: 1;
    text-align: left;
    padding: 0;
  }
`;

const Period = styled.div`
  font-size: 12px;
  color: ${colors.ink50};
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  font-family: ${fonts.mono};
`;

const Title = styled.h3`
  font-family: ${fonts.display};
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const TypeBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  color: ${colors.gold};
  border: 1px solid ${colors.goldFaint};
  border-radius: 2px;
  padding: 3px 10px;
  font-family: ${fonts.mono};
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const Org = styled.div`
  font-size: 14px;
  color: ${colors.ink45};
  margin-bottom: 14px;
`;

const Desc = styled.p`
  font-size: 15px;
  line-height: 1.65;
  color: ${colors.ink70};
  margin: 0 0 14px 0;
`;

const Bullets = styled.ul`
  margin: 0 0 14px 0;
  padding: 0;
  list-style: none;
  color: ${colors.ink70};
  font-size: 15px;
  line-height: 1.65;

  li {
    margin-bottom: 8px;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: ${({ $side }) => ($side === 'left' ? 'flex-end' : 'flex-start')};

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`;

const Tag = styled.span`
  font-size: 11px;
  color: ${colors.ink70};
  background: ${colors.ink04};
  border: 1px solid ${colors.ink15};
  border-radius: 2px;
  padding: 3px 8px;
  font-family: ${fonts.mono};
`;

const JourneyNode = ({ node }) => {
  const [ref, visible] = useRevealOnScroll();

  return (
    <Row ref={ref} $visible={visible}>
      <Dot $current={node.current} />
      <Connector $side={node.side} $visible={visible} />
      <Card $side={node.side}>
        <Period>{node.period}</Period>
        <Title>{node.title}</Title>
        <TypeBadge>{node.type}</TypeBadge>
        <Org>{node.org}</Org>
        {node.desc && <Desc>{node.desc}</Desc>}
        {node.bullets.length > 0 && (
          <Bullets>
            {node.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </Bullets>
        )}
        {node.tags.length > 0 && (
          <Tags $side={node.side}>
            {node.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        )}
      </Card>
    </Row>
  );
};

export default JourneyNode;
```

- [ ] **Step 3: Write `src/components/Journey.js`**

```jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../theme';
import { buildJourneyNodes } from '../utils/journeyNodes';
import { useSectionScrollProgress } from '../hooks/useScrollProgress';
import RiverPath from './RiverPath';
import JourneyNode from './JourneyNode';
import { JourneySkeleton } from './LoadingSkeleton';

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 100px 48px 60px;

  @media (max-width: 760px) {
    padding: 60px 20px;
  }
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.ink40};
  margin-bottom: 12px;
  font-family: ${fonts.mono};
`;

const Heading = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const Rule = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.gold};
  margin-bottom: 24px;
`;

const Subheading = styled.p`
  font-size: 16px;
  color: ${colors.ink55};
  max-width: 600px;
  margin: 0 0 60px 0;
`;

const PathWrap = styled.div`
  position: relative;
`;

const Journey = () => {
  const { t, i18n } = useTranslation();
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const progress = useSectionScrollProgress(sectionRef);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const language = i18n.language;
      const [educationRes, experienceRes] = await Promise.all([
        fetch(`/data/education_${language}.json`),
        fetch(`/data/experience_${language}.json`),
      ]);
      setEducation(await educationRes.json());
      setExperience(await experienceRes.json());
      setLoading(false);
    };
    load();
  }, [i18n.language]);

  const nodes = useMemo(() => {
    if (education.length === 0 || experience.length === 0) return [];
    return buildJourneyNodes({
      education,
      experience,
      typeLabels: t('journey.types', { returnObjects: true }),
      educationTitle: t('journey.educationTitle'),
      educationDesc: t('journey.educationDesc'),
    });
  }, [education, experience, t, i18n.language]);

  return (
    <Section id="journey" ref={sectionRef}>
      <Eyebrow>{t('journey.scene')}</Eyebrow>
      <Heading>{t('journey.heading')}</Heading>
      <Rule />
      <Subheading>{t('journey.subheading')}</Subheading>

      {loading ? (
        <JourneySkeleton />
      ) : (
        <PathWrap>
          <RiverPath nodeCount={nodes.length} progress={progress} />
          {nodes.map((node) => (
            <JourneyNode key={node.id} node={node} />
          ))}
        </PathWrap>
      )}
    </Section>
  );
};

export default Journey;
```

- [ ] **Step 4: Delete the old files**

```bash
git rm src/components/Education.js src/components/WorkExperience.js
```

- [ ] **Step 5: Verify manually**

Run `npm start`, scroll to the Journey section (the `#journey` header link now works). Confirm: 6 milestones appear in order (Education, EuroMov, Vaisala, Sanofi, IMT Mines Alès MLOps, GENFIT), alternating left/right, each fading in as it enters the viewport; the GENFIT dot pulses (it's the only "current" one); the river behind them is a blue/teal gradient line that visibly extends further down as you scroll through the section, with a continuous flowing dash animation independent of scroll; below 760px the layout collapses to a single left-aligned column with a dashed vertical line and the SVG river hides. Toggle EN/FR and confirm the education title/type badges translate.

- [ ] **Step 6: Run the full test suite**

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: PASS (all Task 3 tests still green; no new automated tests added in this task since the new logic they'd exercise — `buildJourneyNodes`, `buildRiverPath` — is already covered in Task 3).

- [ ] **Step 7: Commit**

```bash
git add src/components/JourneyNode.js src/components/Journey.js src/components/LoadingSkeleton.js
git commit -m "feat: replace Education/WorkExperience with the river Journey section"
```

---

### Task 9: Hackathons ("Quests")

**Files:**
- Modify: `src/components/Hackathons.js`

**Interfaces:**
- Consumes: `colors`, `fonts` (Task 1); locale keys `quests.*` (Task 2); `useRevealOnScroll` (Task 4); `HackathonSkeleton` (already recolored in Task 8).

- [ ] **Step 1: Replace `src/components/Hackathons.js`**

```jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import LaunchIcon from '@mui/icons-material/Launch';
import { HackathonSkeleton } from './LoadingSkeleton';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { colors, fonts } from '../theme';

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 60px 48px;

  @media (max-width: 760px) {
    padding: 60px 20px;
  }
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.ink40};
  margin-bottom: 12px;
  font-family: ${fonts.mono};
`;

const Heading = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const Rule = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.gold};
  margin-bottom: 24px;
`;

const Subheading = styled.p`
  font-size: 16px;
  color: ${colors.ink55};
  max-width: 640px;
  margin: 0 0 48px 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  position: relative;
  background: ${colors.ink02};
  border: 1px solid ${colors.ink15};
  border-radius: 4px;
  padding: 36px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(28px)')};
  transition: opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(156, 122, 63, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 18px;
    height: 18px;
    border-top: 1px solid ${colors.gold};
    border-left: 1px solid ${colors.gold};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 18px;
    height: 18px;
    border-bottom: 1px solid ${colors.gold};
    border-right: 1px solid ${colors.gold};
  }

  @media (max-width: 600px) {
    padding: 22px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 6px;
`;

const Name = styled.h3`
  font-family: ${fonts.display};
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: ${colors.ink};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Badges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.goldDark};
  background: ${colors.goldSoft};
  border-radius: 2px;
  padding: 5px 10px;
  white-space: nowrap;
  font-family: ${fonts.mono};
`;

const Organizer = styled.div`
  color: ${colors.ink40};
  font-size: 14px;
  margin-bottom: 16px;
`;

const Details = styled.div`
  display: flex;
  gap: 20px;
  color: ${colors.ink40};
  font-size: 13px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  font-family: ${fonts.mono};

  svg {
    font-size: 14px;
    margin-right: 4px;
    vertical-align: -2px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: ${colors.ink70};
  margin: 0 0 20px 0;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  font-size: 12px;
  color: ${colors.ink70};
  background: ${colors.ink04};
  border: 1px solid ${colors.ink15};
  border-radius: 2px;
  padding: 4px 10px;
  font-family: ${fonts.mono};
`;

const Links = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const LinkItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${colors.goldDark};
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  font-family: ${fonts.mono};

  &:hover {
    color: ${colors.ink};
  }

  svg {
    font-size: 15px;
  }
`;

const QuestCard = ({ item }) => {
  const [ref, visible] = useRevealOnScroll();

  return (
    <Card ref={ref} $visible={visible}>
      <CardHeader>
        <Name><EmojiEventsIcon style={{ color: colors.gold, fontSize: 22 }} />{item.name}</Name>
        <Badges>
          {item.rankings.map((ranking, i) => (
            <Badge key={i}>{ranking.rank} {ranking.metric}</Badge>
          ))}
        </Badges>
      </CardHeader>
      <Organizer>{item.organizer}</Organizer>
      <Details>
        <span><CalendarTodayIcon />{item.date}</span>
        <span><LocationOnIcon />{item.location}</span>
        <span><GroupIcon />{item.team} — {item.username}</span>
      </Details>
      <Description>{item.description}</Description>
      <Tags>
        {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </Tags>
      <Links>
        {item.links.map((link, i) => (
          <LinkItem key={i} href={link.url} target="_blank" rel="noopener noreferrer">
            <LaunchIcon />{link.label}
          </LinkItem>
        ))}
      </Links>
    </Card>
  );
};

const Hackathons = () => {
  const { t, i18n } = useTranslation();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetch(`/data/hackathons_${i18n.language}.json`);
      setHackathons(await response.json());
      setLoading(false);
    };
    load();
  }, [i18n.language]);

  return (
    <Section id="quests">
      <Eyebrow>{t('quests.scene')}</Eyebrow>
      <Heading>{t('quests.heading')}</Heading>
      <Rule />
      <Subheading>{t('quests.subheading')}</Subheading>
      {loading ? (
        <List><HackathonSkeleton /></List>
      ) : (
        <List>
          {hackathons.map((item, i) => <QuestCard key={i} item={item} />)}
        </List>
      )}
    </Section>
  );
};

export default Hackathons;
```

- [ ] **Step 2: Verify manually**

Run `npm start`, scroll to the Quests section (`#quests`, now reachable from the header). Confirm: the CrunchDAO card renders with the gold corner brackets, ranking badges, and hover lift/border-glow; the card fades in on scroll. Toggle EN/FR and confirm the heading/subheading translate while the CrunchDAO data itself still comes from `hackathons_fr.json`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hackathons.js
git commit -m "feat: restyle Hackathons as quest cards"
```

---

### Task 10: Technical stack chip cloud

**Files:**
- Modify: `src/components/TechnicalStack.js`

**Interfaces:**
- Consumes: `colors`, `fonts` (Task 1); locale keys `stack.*` (Task 2); existing `src/data/techStack.json` (unchanged).

- [ ] **Step 1: Replace `src/components/TechnicalStack.js`**

```jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import techStackData from '../data/techStack.json';
import { colors, fonts } from '../theme';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 60px 48px;

  @media (max-width: 760px) {
    padding: 60px 20px;
  }
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.ink40};
  margin-bottom: 12px;
  font-family: ${fonts.mono};
`;

const Heading = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const Rule = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.gold};
  margin-bottom: 48px;
`;

const Cloud = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${colors.ink70};
  background: ${colors.ink02};
  border: 1px solid ${colors.ink15};
  border-radius: 2px;
  padding: 10px 16px;
  font-family: ${fonts.mono};
  animation: ${float} 3.2s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: ${colors.gold};
    color: ${colors.goldDark};
  }

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
`;

const DELAYS = [0, 0.3, 0.6, 0.9, 1.2];

const TechnicalStack = () => {
  const { t } = useTranslation();

  return (
    <Section id="stack">
      <Eyebrow>{t('stack.scene')}</Eyebrow>
      <Heading>{t('stack.heading')}</Heading>
      <Rule />
      <Cloud>
        {techStackData.map((tool, i) => (
          <Chip key={tool.name} $delay={DELAYS[i % DELAYS.length]}>
            <img src={tool.icon} alt="" />
            {tool.name}
          </Chip>
        ))}
      </Cloud>
    </Section>
  );
};

export default TechnicalStack;
```

- [ ] **Step 2: Verify manually**

Run `npm start`, scroll to `#stack`. Confirm: all 21 tools render as bobbing chips with staggered float timing, hovering a chip turns its border/text gold.

- [ ] **Step 3: Commit**

```bash
git add src/components/TechnicalStack.js
git commit -m "feat: restyle TechnicalStack as a floating chip cloud"
```

---

### Task 11: Projects grid ("Work")

**Files:**
- Modify: `src/components/ProjectCard.js`
- Modify: `src/components/Projects.js`

**Interfaces:**
- Consumes: `colors`, `fonts` (Task 1); locale keys `work.*` (Task 2); `useRevealOnScroll` (Task 4); `ProjectSkeleton` (already recolored in Task 8).
- Note: section id changes from `projects` to `work` to match the new nav (`#work`), matching what `Header.js` (Task 5) already links to.

- [ ] **Step 1: Replace `src/components/ProjectCard.js`**

```jsx
import React from 'react';
import styled from 'styled-components';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { colors, fonts } from '../theme';

const Card = styled.div`
  position: relative;
  background: ${colors.ink02};
  border: 1px solid ${colors.ink15};
  border-radius: 4px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(28px)')};
  transition: opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(156, 122, 63, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 16px;
    height: 16px;
    border-top: 1px solid ${colors.gold};
    border-left: 1px solid ${colors.gold};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 16px;
    height: 16px;
    border-bottom: 1px solid ${colors.gold};
    border-right: 1px solid ${colors.gold};
  }
`;

const Title = styled.h3`
  font-family: ${fonts.display};
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: ${colors.ink};
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.65;
  color: ${colors.ink70};
  margin: 0 0 18px 0;
  flex: 1;
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 18px;
`;

const Tag = styled.span`
  font-size: 11px;
  color: ${colors.ink70};
  background: ${colors.ink04};
  border: 1px solid ${colors.ink15};
  border-radius: 2px;
  padding: 3px 8px;
  font-family: ${fonts.mono};
`;

const Links = styled.div`
  display: flex;
  gap: 16px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: ${colors.ink50};
    text-decoration: none;
    font-size: 13px;
    font-family: ${fonts.mono};

    &:hover {
      color: ${colors.gold};
    }
  }
`;

const ProjectCard = ({ project }) => {
  const [ref, visible] = useRevealOnScroll();

  return (
    <Card ref={ref} $visible={visible}>
      <Title>{project.title}</Title>
      <Description>{project.description}</Description>
      <Tags>
        {project.tech.map((tech) => <Tag key={tech}>{tech}</Tag>)}
      </Tags>
      <Links>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon style={{ fontSize: 16 }} /> GitHub
          </a>
        )}
        {project.external && project.external !== project.github && (
          <a href={project.external} target="_blank" rel="noopener noreferrer">
            <LaunchIcon style={{ fontSize: 16 }} /> Live
          </a>
        )}
      </Links>
    </Card>
  );
};

export default ProjectCard;
```

- [ ] **Step 2: Replace `src/components/Projects.js`**

```jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ProjectCard from './ProjectCard';
import { ProjectSkeleton } from './LoadingSkeleton';
import { colors, fonts } from '../theme';

const Section = styled.section`
  max-width: 1060px;
  margin: 0 auto;
  padding: 60px 48px 120px;

  @media (max-width: 760px) {
    padding: 60px 20px 80px;
  }
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.ink40};
  margin-bottom: 12px;
  font-family: ${fonts.mono};
`;

const Heading = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const Rule = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.gold};
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetch(`/data/projects_${i18n.language}.json`);
      setProjects(await response.json());
      setLoading(false);
    };
    load();
  }, [i18n.language]);

  return (
    <Section id="work">
      <Eyebrow>{t('work.scene')}</Eyebrow>
      <Heading>{t('work.heading')}</Heading>
      <Rule />
      {loading ? (
        <Grid>
          {[...Array(3)].map((_, i) => <ProjectSkeleton key={i} />)}
        </Grid>
      ) : (
        <Grid>
          {projects.map((project, i) => <ProjectCard key={i} project={project} />)}
        </Grid>
      )}
    </Section>
  );
};

export default Projects;
```

- [ ] **Step 3: Verify manually**

Run `npm start`, scroll to `#work`. Confirm: all 6 projects render as corner-bracket cards in a responsive grid (3 columns wide, fewer on narrower viewports), each with title, description, tech tags, and working GitHub link.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.js src/components/Projects.js
git commit -m "feat: restyle Projects as a grid of all 6 projects under #work"
```

---

### Task 12: Contact

**Files:**
- Modify: `src/components/Contact.js`

**Interfaces:**
- Consumes: `colors`, `fonts` (Task 1); locale keys `contact.*` (Task 2).

- [ ] **Step 1: Replace `src/components/Contact.js`**

```jsx
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../theme';

const Section = styled.section`
  max-width: 760px;
  margin: 0 auto;
  padding: 60px 48px 160px;
  text-align: center;

  @media (max-width: 760px) {
    padding: 60px 20px 100px;
  }
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.ink40};
  margin-bottom: 12px;
  font-family: ${fonts.mono};
`;

const Heading = styled.h2`
  font-family: ${fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${colors.ink};
`;

const Rule = styled.div`
  width: 60px;
  height: 2px;
  background: ${colors.gold};
  margin: 0 auto 24px;
`;

const Description = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: ${colors.ink65};
  margin: 0 0 36px 0;
`;

const EmailButton = styled.a`
  display: inline-block;
  background: ${colors.ink};
  color: ${colors.bg};
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  padding: 16px 32px;
  border-radius: 2px;
  margin-bottom: 32px;
  font-family: ${fonts.mono};
  transition: background 0.2s ease;

  &:hover {
    background: #3a352e;
  }
`;

const LinksRow = styled.div`
  display: flex;
  gap: 28px;
  justify-content: center;
`;

const SocialLink = styled.a`
  color: ${colors.ink50};
  text-decoration: none;
  font-size: 13px;
  font-family: ${fonts.mono};

  &:hover {
    color: ${colors.ink};
  }
`;

const Contact = () => {
  const { t } = useTranslation();

  return (
    <Section id="contact">
      <Eyebrow>{t('contact.scene')}</Eyebrow>
      <Heading>{t('contact.heading')}</Heading>
      <Rule />
      <Description>{t('contact.description')}</Description>
      <EmailButton href="mailto:amine.mekki.contact@gmail.com">
        amine.mekki.contact@gmail.com
      </EmailButton>
      <LinksRow>
        <SocialLink href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer">GITHUB</SocialLink>
        <SocialLink href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer">LINKEDIN</SocialLink>
      </LinksRow>
    </Section>
  );
};

export default Contact;
```

- [ ] **Step 2: Verify manually**

Run `npm start`, scroll to `#contact`. Confirm: heading/description/email button render in the new style, the mailto link opens the default mail client, GitHub/LinkedIn links open in a new tab. Toggle EN/FR and confirm the description translates.

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.js
git commit -m "feat: restyle Contact section"
```

---

### Task 13: Footer, sidebars, and scroll-to-top

**Files:**
- Modify: `src/components/Footer.js`
- Modify: `src/components/SocialSidebar.js`
- Modify: `src/components/EmailSidebar.js`
- Modify: `src/components/ScrollToTop.js`

**Interfaces:**
- Consumes: `colors`, `fonts` (Task 1).

- [ ] **Step 1: Replace `src/components/Footer.js`**

```jsx
import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../theme';

const StyledFooter = styled.footer`
  border-top: 1px solid ${colors.ink10};
  padding: 28px 48px;
  text-align: center;
  color: ${colors.ink40};
  font-size: 12px;
  font-family: ${fonts.mono};
`;

const Footer = () => (
  <StyledFooter>
    AMINE_MEKKI · AI ENGINEER · LILLE, FRANCE · {new Date().getFullYear()}
  </StyledFooter>
);

export default Footer;
```

- [ ] **Step 2: Replace `src/components/SocialSidebar.js`**

```jsx
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { colors } from '../theme';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 24px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    display: none;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 16px;
`;

const Link = styled.a`
  color: ${colors.ink40};
  font-size: 18px;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.gold};
  }
`;

const Line = styled.div`
  width: 1px;
  height: 80px;
  background-color: ${colors.ink15};
  margin-top: 16px;
`;

const SocialSidebar = () => (
  <Container>
    <List>
      <li><Link href="https://github.com/AmineMekki01" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} /></Link></li>
      <li><Link href="https://www.linkedin.com/in/mekki-amine/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></Link></li>
    </List>
    <Line />
  </Container>
);

export default SocialSidebar;
```

- [ ] **Step 3: Replace `src/components/EmailSidebar.js`**

```jsx
import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../theme';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 24px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    display: none;
  }
`;

const EmailText = styled.a`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: ${colors.ink40};
  font-family: ${fonts.mono};
  font-size: 13px;
  text-decoration: none;

  &:hover {
    color: ${colors.gold};
  }
`;

const Line = styled.div`
  width: 1px;
  height: 80px;
  background-color: ${colors.ink15};
  margin-top: 16px;
`;

const EmailSidebar = () => (
  <Container>
    <EmailText href="mailto:amine.mekki.contact@gmail.com">amine.mekki.contact@gmail.com</EmailText>
    <Line />
  </Container>
);

export default EmailSidebar;
```

- [ ] **Step 4: Replace `src/components/ScrollToTop.js`**

```jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { colors } from '../theme';

const Button = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${colors.ink};
  color: ${colors.bg};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease, background 0.2s ease;
  transform: ${({ $visible }) => ($visible ? 'translateY(0)' : 'translateY(20px)')};
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(20, 18, 16, 0.15);

  &:hover {
    background-color: #3a352e;
  }

  svg {
    font-size: 1.4rem;
  }

  @media (max-width: 600px) {
    bottom: 20px;
    right: 20px;
    width: 38px;
    height: 38px;
  }
`;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Button $visible={visible} onClick={scrollToTop} aria-label="Scroll to top">
      <KeyboardArrowUpIcon />
    </Button>
  );
};

export default ScrollToTop;
```

- [ ] **Step 5: Verify manually**

Run `npm start`. Confirm: footer is a single centered ink-on-parchment line with the current year; the fixed GitHub/LinkedIn icons (bottom-left) and the vertical email link (bottom-right) are visible on desktop and hidden below 760px; scrolling past 400px shows the round scroll-to-top button, clicking it scrolls smoothly to the top.

- [ ] **Step 6: Commit**

```bash
git add src/components/Footer.js src/components/SocialSidebar.js src/components/EmailSidebar.js src/components/ScrollToTop.js
git commit -m "feat: restyle footer, sidebars, and scroll-to-top button"
```

---

### Task 14: App assembly, cleanup, and final verification

**Files:**
- Modify: `src/App.js`
- Modify: `src/App.test.js`
- Delete: `src/components/About.js`
- Delete: `src/components/AnimatedBackground.js`

**Interfaces:**
- Consumes: every component from Tasks 5–13; `useGlobalScrollProgress` from `../hooks/useScrollProgress` (Task 4); `colors` (Task 1).

**Context:** `About.js` and `AnimatedBackground.js` (only ever imported by `About.js`/old `Hero.js`) have no place in the new design — the reference mockup has no standalone "about" scene, and About's terminal "whoami" content (name, title, specialties, stack) is now fully covered by the new Hero (name/title/tagline) and Stack section (full tech list).

- [ ] **Step 1: Replace `src/App.js`**

```jsx
import React from 'react';
import { CssBaseline } from '@mui/material';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import MarqueeTicker from './components/MarqueeTicker';
import Journey from './components/Journey';
import Hackathons from './components/Hackathons';
import TechnicalStack from './components/TechnicalStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import EmailSidebar from './components/EmailSidebar';
import ScrollToTop from './components/ScrollToTop';
import { colors } from './theme';
import { useGlobalScrollProgress } from './hooks/useScrollProgress';

const Page = styled.div`
  background-color: ${colors.bg};
  color: ${colors.ink};
  min-height: 100vh;
  position: relative;
`;

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: ${colors.gold};
  z-index: 100;
  width: ${({ $progress }) => $progress * 100}%;
  transition: width 0.1s linear;
`;

function App() {
  const progress = useGlobalScrollProgress();

  return (
    <Page>
      <CssBaseline />
      <ProgressBar $progress={progress} />
      <Header />
      <Hero />
      <MarqueeTicker />
      <Journey />
      <Hackathons />
      <TechnicalStack />
      <Projects />
      <Contact />
      <SocialSidebar />
      <EmailSidebar />
      <ScrollToTop />
      <Footer />
    </Page>
  );
}

export default App;
```

- [ ] **Step 2: Delete the now-unused files**

```bash
git rm src/components/About.js src/components/AnimatedBackground.js
```

- [ ] **Step 3: Replace `src/App.test.js`**

The old test asserted a "learn react" string that has never existed in this app (stale CRA boilerplate). `Journey`, `Hackathons`, and `Projects` now call `fetch` on mount, which doesn't exist in the default jsdom test environment, so it needs mocking:

```jsx
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders the hero name', () => {
  render(<App />);
  expect(screen.getByText(/Amine MEKKI/i)).toBeInTheDocument();
});
```

- [ ] **Step 4: Run the full test suite**

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: PASS — all Task 3 unit tests plus the updated `App.test.js`, no failures, no console errors about missing `fetch`.

- [ ] **Step 5: Production build check**

Run: `CI=true npm run build`
Expected: build succeeds with no errors (warnings about unused variables, if any, should be fixed before moving on — there shouldn't be any given every file was fully rewritten in this plan).

- [ ] **Step 6: Full manual walkthrough**

Run `npm start` and go through the checklist from the design spec (`docs/superpowers/specs/2026-08-07-river-journey-redesign-design.md`):
- Desktop width: hero loads, marquee scrolls, river draws in as you scroll through Journey, all 6 milestones alternate sides correctly, quest/project cards reveal on scroll, contact/footer render correctly, top progress bar fills as you scroll the whole page.
- Mobile width (< 760px): header collapses to the MENU drawer, Journey collapses to a single left-aligned column with the river hidden, sidebars hide, everything remains readable.
- Toggle EN ↔ FR from the header and confirm every section's text (including Journey's education/experience data and Hackathons/Projects data) switches language.
- Click every link: header nav anchors, hero CTAs, resume download, GitHub/LinkedIn (header-less now, but present in Hero/Contact/sidebars), hackathon leaderboard/announcement links, project GitHub links, contact mailto.

- [ ] **Step 7: Commit**

```bash
git add src/App.js src/App.test.js
git commit -m "feat: assemble the redesigned App and remove the old About/AnimatedBackground components"
```

---

## Self-review notes

- **Spec coverage:** every section named in the design spec (header, hero, marquee, journey/river, quests, stack, work, contact, footer, sidebars, scroll-to-top) has a task; About/AnimatedBackground removal is Task 14; i18n is threaded through every task via Task 2's locale content; the river's blue/teal palette + scroll-linked draw + continuous flow animation is Task 7; mobile collapse behavior is specified per-component in Tasks 8, 9, 11, 13.
- **Type consistency:** `JourneyNode` shape (`{ id, side, type, period, title, org, desc, bullets, tags, current }`) is defined once in Task 3's `buildJourneyNodes` and consumed as-is by `JourneyNode.js` in Task 8 — no renamed fields. `RiverPath` props (`nodeCount`, `progress`) match between Task 7's definition and Task 8's usage. Hook return shapes (`[ref, visible]`, plain `number`) are consistent between Task 4's definitions and every consumer.
- **Placeholder scan:** no TBDs; every step has literal, runnable code or an exact shell command.
