# Subtitle Toolkit — UI Redesign Specification

## 1. Brand Identity & Visual Direction

### Positioning

Subtitle Toolkit is a **professional-grade free utility brand**, not a SaaS product, not a startup landing page. Think: "the Squoosh of subtitle tools" — one thing done well, clean, confident, immediately usable.

### Visual Personality

| Trait | Expression |
|---|---|
| Professional | No playful illustrations, no gradients, no stock photos |
| Confident | Large type, strong hierarchy, generous whitespace |
| Tool-oriented | The tool IS the hero. No marketing fluff between user and action |
| Trustworthy | Subtle depth, clean lines, consistent details |
| Calm | Muted palette with one accent. No visual noise |

### What Makes It NOT a Template

- A distinctive **subtitle-timeline motif** woven into the brand (not decoration — structure)
- Strong **asymmetric layouts** instead of centered-everything
- A **dark tool workspace** contrasting against a light page shell
- Typography hierarchy so clear it replaces the need for illustrations
- Consistent **micro-details**: icon style, border radius, shadow depth, interaction states

---

## 2. Color System

### Primary Palette

```
--color-base:      #0A0E1A    (near-black, main text, dark surfaces)
--color-surface:   #FFFFFF    (white, page background)
--color-muted:     #F4F5F7    (light gray, section backgrounds, tool workspace border)
--color-subtle:    #E8EAED    (borders, dividers)
--color-secondary: #6B7280    (gray-500, secondary text, captions)
--color-tertiary:  #9CA3AF    (gray-400, placeholder text, disabled states)
```

### Accent Color: Indigo-Toned Blue

Choose a blue that reads as **technical and authoritative** without being "generic SaaS blue". Indigo shifts it away from the default Tailwind blue (#3B82F6) and toward something more distinctive.

```
--color-accent:       #4F46E5    (indigo-600, primary actions, links, active states)
--color-accent-hover: #4338CA    (indigo-700, hover state)
--color-accent-light: #EEF2FF    (indigo-50, subtle backgrounds, badges)
--color-accent-muted: #C7D2FE    (indigo-200, borders on accent elements)
```

### Semantic Colors

```
--color-success: #059669    (green, "free" badges, privacy trust signals)
--color-warning: #D97706    (amber, rare warnings)
--color-danger:  #DC2626    (red, errors only)
```

### Dark Workspace Palette (Tool Area)

The tool input/output area uses a slightly dark-mode palette to create visual separation from the page shell and to echo a "code editor / timeline" feel:

```
--color-workspace-bg:   #1E1E2E    (dark surface for tool workspace)
--color-workspace-text: #CDD6F4    (light text on dark workspace)
--color-workspace-muted:#585B70    (muted text on dark workspace)
--color-workspace-border:#313244   (borders inside workspace)
--color-workspace-input:#181825    (input fields inside workspace)
```

### Color Usage Rules

1. **One accent only.** Indigo is the only colored element on light backgrounds (except semantic greens for trust).
2. **Dark workspace is the brand differentiator.** It makes tool pages feel like a professional editing environment, not a web form.
3. **Never use accent color for large background fills.** Accent is for buttons, links, active tabs, and small highlights only.
4. **Green is reserved for trust signals** ("Free", "No signup", "Local processing").
5. **No gradients.** Flat colors only. Depth comes from shadows and borders, not color blending.

---

## 3. Typography

### Font Stack

**Primary:** Inter (via Google Fonts or self-hosted)

```
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', ui-monospace, monospace;
```

**Why Inter over Atkinson:**
- Inter has a larger weight range (100–900) and superior readability at small sizes
- It's the de facto standard for utility products (Figma, Linear, Vercel all use it)
- It pairs naturally with monospace fonts for code/subtitle content
- It renders crisply across all platforms

**Why JetBrains Mono for code/subtitles:**
- Distinguishes subtitle content from UI text at a glance
- Better ligature support for timestamp patterns (00:00:01,000)
- Professional "editor" feel in the workspace

### Type Scale

Use a **modular scale based on 1.25 ratio** with fluid sizing:

```
--text-xs:    0.75rem    (12px) — captions, metadata, file names
--text-sm:    0.875rem   (14px) — secondary text, descriptions, form labels
--text-base:  1rem       (16px) — body text, paragraphs
--text-lg:    1.125rem   (18px) — lead paragraphs, emphasis text
--text-xl:    1.25rem    (20px) — card titles, section subtitles
--text-2xl:   1.5rem     (24px) — section headings
--text-3xl:   1.875rem   (30px) — page titles
--text-4xl:   2.25rem    (36px) — hero secondary heading
--text-5xl:   3rem       (48px) — hero primary heading (desktop)
--text-6xl:   3.75rem    (60px) — homepage hero only (desktop)
```

### Weight System

```
--weight-normal:  400  — body text
--weight-medium:  500  — labels, navigation
--weight-semibold:600  — card titles, emphasis
--weight-bold:    700  — headings, CTAs
--weight-extrabold:800 — hero heading only
```

### Line Height

```
--leading-tight:  1.15  — headings h1-h3
--leading-snug:   1.3   — headings h4-h6, card titles
--leading-normal: 1.6   — body text
--leading-relaxed:1.75  — long-form prose (guides)
```

### Letter Spacing

```
--tracking-tight:   -0.025em  — headings h1-h3
--tracking-normal:   0        — body text
--tracking-wide:     0.025em  — uppercase labels, badges
--tracking-wider:    0.05em   — eyebrow text
```

### Typographic Hierarchy

| Element | Size | Weight | Tracking | Leading | Color |
|---|---|---|---|---|---|
| Hero h1 | text-6xl→text-5xl (fluid) | 800 | tight | tight | --color-base |
| Section h2 | text-3xl | 700 | tight | tight | --color-base |
| Card h3 | text-xl | 600 | normal | snug | --color-base |
| Body | text-base | 400 | normal | normal | --color-base |
| Secondary | text-sm | 400 | normal | normal | --color-secondary |
| Caption | text-xs | 500 | wide | normal | --color-tertiary |
| Eyebrow | text-xs | 600 | wider | tight | --color-accent |
| Mono (subtitles) | text-sm | 400 | normal | relaxed | --color-workspace-text |

---

## 4. Spacing & Layout System

### Spacing Scale (4px base)

```
--space-1:  0.25rem  (4px)
--space-2:  0.5rem   (8px)
--space-3:  0.75rem  (12px)
--space-4:  1rem     (16px)
--space-5:  1.25rem  (20px)
--space-6:  1.5rem   (24px)
--space-8:  2rem     (32px)
--space-10: 2.5rem   (40px)
--space-12: 3rem     (48px)
--space-16: 4rem     (64px)
--space-20: 5rem     (80px)
--space-24: 6rem     (96px)
```

### Layout Constants

```
--max-width:     1200px   (content container)
--max-width-narrow: 760px (guide prose, narrow content)
--gutter:        1.5rem   (mobile) / 2rem (desktop)
--section-gap:   --space-20 (between major page sections)
--card-gap:      --space-6  (between cards in grid)
```

### Grid System

- **Homepage tool grid:** 3 columns desktop, 2 columns tablet, 1 column mobile
- **Tool page info grid:** 3 columns desktop, 1 column mobile
- **Guide grid:** 2 columns desktop, 1 column mobile
- **All grids use:** `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`

### Border Radius

```
--radius-sm:   6px    (buttons, badges, small elements)
--radius-md:   10px   (cards, panels)
--radius-lg:   16px   (workspace container, large panels)
--radius-xl:   20px   (modal, overlay)
--radius-full: 9999px (pills, avatars)
```

### Shadows

```
--shadow-sm:  0 1px 2px rgba(10, 14, 26, 0.05)
--shadow-md:  0 2px 8px rgba(10, 14, 26, 0.08)
--shadow-lg:  0 8px 24px rgba(10, 14, 26, 0.12)
--shadow-xl:  0 16px 48px rgba(10, 14, 26, 0.16)
--shadow-workspace: 0 0 0 1px rgba(49, 50, 68, 1), inset 0 1px 0 rgba(255,255,255,0.03)
```

---

## 5. Component System

### 5.1 Navigation Bar

- Height: 64px
- Background: white with bottom border (--color-subtle), no blur/glass effect
- Left: SVG logo mark + "Subtitle Toolkit" text (font-weight: 700, 1rem)
- Center/Right: nav links (Tools, Guides) — font-weight: 500, text-sm, with underline on active
- Far right: "Use Tools →" button (accent, --radius-sm)
- Mobile: hamburger menu or horizontal scroll nav
- **No frosted glass.** Clean, solid, authoritative.

### 5.2 Buttons

**Primary (accent):**
```
background: --color-accent
color: white
padding: 10px 20px
border-radius: --radius-sm
font-weight: 600
font-size: --text-sm
hover: --color-accent-hover, translate-y(-1px), --shadow-md
```

**Secondary (outline):**
```
background: transparent
color: --color-base
border: 1px solid --color-subtle
padding: 10px 20px
border-radius: --radius-sm
font-weight: 600
font-size: --text-sm
hover: border-color --color-secondary, background --color-muted
```

**Ghost:**
```
background: transparent
color: --color-secondary
padding: 10px 16px
font-weight: 500
font-size: --text-sm
hover: color --color-base, background --color-muted
```

**Workspace Button (on dark bg):**
```
background: --color-accent
color: white
padding: 10px 20px
border-radius: --radius-sm
font-weight: 600
font-size: --text-sm
hover: --color-accent-hover
```

### 5.3 Cards

**Tool Card (light):**
```
background: --color-surface
border: 1px solid --color-subtle
border-radius: --radius-md
padding: --space-6
hover: border-color --color-accent-muted, --shadow-md, translate-y(-2px)
transition: all 0.2s ease
```

Structure:
- Format badges row (e.g., "SRT → VTT" in pill badges)
- Title (text-xl, semibold)
- Description (text-sm, --color-secondary)
- Arrow link to tool page

**Info Card (tool page bottom):**
```
background: --color-muted (not white — secondary content zone)
border: none
border-radius: --radius-md
padding: --space-6
```

### 5.4 Badges / Pills

**Format Badge:**
```
background: --color-accent-light
color: --color-accent
padding: 4px 10px
border-radius: --radius-full
font-size: --text-xs
font-weight: 600
letter-spacing: --tracking-wide
```

**Trust Badge (green):**
```
background: #ECFDF5
color: --color-success
padding: 4px 10px
border-radius: --radius-full
font-size: --text-xs
font-weight: 600
```

**Eyebrow Badge:**
```
color: --color-accent
font-size: --text-xs
font-weight: 600
letter-spacing: --tracking-wider
text-transform: uppercase
(no background pill — just styled text, more editorial)
```

### 5.5 Tool Workspace

The workspace is the core differentiator. It's a **dark container** that sits inside the light page:

```
background: --color-workspace-bg
border-radius: --radius-lg
padding: --space-8
box-shadow: --shadow-workspace
```

**Inside the workspace:**
- Input panel (left) and Output panel (right) — both dark
- Mode tabs (Upload / Paste) — dark-styled tab bar
- Textareas — use --color-workspace-input background, monospace font
- Action buttons — accent colored, same style as light buttons but on dark
- File drop zone — dashed border in --color-workspace-border
- Processing hint text — --color-workspace-muted color

**Workspace Tab Bar:**
```
background: --color-workspace-input
border-radius: --radius-sm
padding: 4px
display: inline-flex
gap: 4px
```

**Active Tab:**
```
background: --color-workspace-bg
color: --color-workspace-text
border-radius: --radius-sm (4px inner)
```

**Inactive Tab:**
```
background: transparent
color: --color-workspace-muted
```

### 5.6 Section Divider

Instead of lines, use **spacing rhythm** and **background color shifts**:
- Alternate between white (--color-surface) and light gray (--color-muted) backgrounds
- Full-bleed background changes create natural visual separation
- No visible `<hr>` between major sections

### 5.7 Footer

- Background: --color-base (near-black)
- Text: --color-tertiary (light gray)
- Links: --color-secondary, hover to white
- Two-column layout: left = brand + tagline, right = link columns
- Clean and compact, no more than 200px tall

---

## 6. Icon System

Use **Phosphor Icons** (regular/line weight) — clean, consistent, modern utility feel:

| Context | Icon |
|---|---|
| Format conversion | `arrows-clockwise` |
| Time shift | `clock-clockwise` |
| Cleaner | `broom` |
| Upload | `upload-simple` |
| Paste | `clipboard-text` |
| Copy | `copy` |
| Download | `download-simple` |
| Sample | `play` |
| Clear | `x` |
| Arrow link | `arrow-right` |
| Check/trust | `check-circle` |
| Shield/privacy | `shield-check` |
| Browser | `browser` |
| File | `file-text` |

Icons are **16px inline** with text, or **24px** standalone. Always use `regular` weight (outline style).

---

## 7. Page Layouts

### 7.1 Homepage (/)

```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  [eyebrow: FREE SUBTITLE TOOLS]                  │
│  Convert, fix, and clean                         │
│  subtitle files in your                          │
│  browser.                                        │
│                                                  │
│  [Browse Tools →]  [Read Guides]                 │
│                                                  │
│  ✓ Free forever  ✓ No signup  ✓ Local processing│
│                                                  │
├─────────── white → muted bg shift ───────────────┤
│                                                  │
│  CORE TOOLS                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ SRT→VTT  │ │ VTT→SRT  │ │ SRT→ASS  │         │
│  │ ...      │ │ ...      │ │ ...      │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ ASS→SRT  │ │ VTT→ASS  │ │ ASS→VTT  │         │
│  │ ...      │ │ ...      │ │ ...      │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                  │
├─────────── muted → white bg shift ───────────────┤
│                                                  │
│  WHY SUBTITLE TOOLKIT                            │
│  ┌─────────────────────────────────────┐         │
│  │ 🛡 No server upload                 │         │
│  │   Files never leave your browser    │         │
│  │                                     │         │
│  │ ⚡ Instant processing               │         │
│  │   No waiting, no queueing           │         │
│  │                                     │         │
│  │ ✓ Free forever                      │         │
│  │   No signup, no limits, no paywall  │         │
│  └─────────────────────────────────────┘         │
│                                                  │
│  [FUTURE AD SLOT — content break zone]           │
│                                                  │
├─────────── white → muted bg shift ───────────────┤
│                                                  │
│  POPULAR GUIDES                                  │
│  ┌──────────────────┐ ┌──────────────────┐       │
│  │ SRT vs VTT       │ │ ASS vs SRT       │       │
│  │ ...              │ │ ...              │       │
│  └──────────────────┘ └──────────────────┘       │
│  ┌──────────────────┐ ┌──────────────────┐       │
│  │ Fix out-of-sync  │ │ Format errors    │       │
│  │ ...              │ │ ...              │       │
│  └──────────────────┘ └──────────────────┘       │
│                                                  │
├─────────────────────────────────────────────────┤
│  FAQ                                             │
│  ▸ Is this really free?                          │
│  ▸ Are my files uploaded anywhere?               │
│  ▸ What formats are supported?                   │
│  ▸ Do I need to create an account?               │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER (dark)                                   │
└─────────────────────────────────────────────────┘
```

**Hero Section Details:**
- Left-aligned, not centered (more editorial, less template-like)
- h1: text-6xl, weight 800, tracking tight
- Hero description: text-lg, --color-secondary, max-width 520px
- Trust signals: horizontal row of green-check badges
- No background glow, no gradient, no illustration
- White background, clean and confident

**Tool Grid Section:**
- Background: --color-muted (subtle shift from white)
- Section padding: --space-20 top and bottom
- 3-column grid
- Each card shows: format badge row → title → description → arrow link
- "View all tools →" link at bottom

**Why Section:**
- 3 trust pillars in a row (icon + title + description)
- Background: white
- Minimal, icon-driven, no cards

**Guide Section:**
- Background: --color-muted
- 2-column grid
- Cards: title + description + date + arrow link
- "View all guides →" link at bottom

**FAQ Section:**
- Background: white
- Accordion-style (click to expand)
- 4-6 questions covering core user concerns

### 7.2 Tools Index (/tools)

```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  [eyebrow: SUBTITLE TOOLS]                       │
│  Free browser-based tools                        │
│  for every subtitle job.                         │
│                                                  │
│  ── FORMAT CONVERSION ─────────────────────────  │
│  ┌───────────────────────────────────────────┐   │
│  │ ┌──────┐ ┌──────┐ ┌──────┐               │   │
│  │ │SRT→VTT│ │VTT→SRT│ │SRT→ASS│              │   │
│  │ └──────┘ └──────┘ └──────┘               │   │
│  │ ┌──────┐ ┌──────┐ ┌──────┐               │   │
│  │ │ASS→SRT│ │VTT→ASS│ │ASS→VTT│              │   │
│  │ └──────┘ └──────┘ └──────┘               │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ── SUBTITLE UTILITIES ────────────────────────  │
│  ┌───────────────────────────────────────────┐   │
│  │ ┌──────────┐  ┌──────────┐                │   │
│  │ │ Time     │  │ Subtitle │                │   │
│  │ │ Shifter  │  │ Cleaner  │                │   │
│  │ └──────────┘  └──────────┘                │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  WHY BROWSER-LOCAL                               │
│  [3 trust pillars — same as homepage]            │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER                                          │
└─────────────────────────────────────────────────┘
```

**Key differences from homepage tool grid:**
- Tools are **categorized** (Format Conversion vs Utilities)
- Each category has a label and visual grouping
- Cards in same category are in one bordered container (a "group card")
- More information per card: format badge + title + one-line description + supported formats

**Tool Card in Tools Index:**
```
┌────────────────────────┐
│ [SRT] → [VTT]         │  ← format badges
│ SRT to VTT Converter   │  ← title (text-xl)
│ Convert SubRip files   │  ← description (text-sm, gray)
│ into WebVTT format     │
│                    →   │  ← arrow link
└────────────────────────┘
```

### 7.3 Tool Detail Page (/tools/[slug])

```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                          │
├─────────────────────────────────────────────────┤
│  [eyebrow: FORMAT CONVERSION]                    │
│  SRT to VTT Converter                            │
│  Convert SubRip subtitle files into WebVTT       │
│  format for HTML5 video.                         │
│                                                  │
│  ✓ Free  ✓ No signup  ✓ Browser-local           │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐ │
│  │          DARK WORKSPACE                      │ │
│  │                                              │ │
│  │  ┌─── INPUT ──────┐  ┌─── OUTPUT ──────┐   │ │
│  │  │ [Upload][Paste] │  │  VTT Output      │   │ │
│  │  │                 │  │                  │   │ │
│  │  │  ┌───────────┐  │  │  ┌────────────┐ │   │ │
│  │  │  │ dropzone  │  │  │  │ (result)   │ │   │ │
│  │  │  │ or paste  │  │  │  │            │ │   │ │
│  │  │  └───────────┘  │  │  └────────────┘ │   │ │
│  │  │                 │  │                  │   │
│  │  │ [Sample] [Clear]│  │ [Copy] [Download]│   │ │
│  │  └─────────────────┘  └──────────────────┘   │ │
│  │                                              │ │
│  │  Runs locally in your browser • No upload    │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
├──── white → muted bg ────────────────────────────┤
│                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ WHEN TO    │ │ FAQ        │ │ RELATED    │   │
│  │ USE THIS   │ │            │ │            │   │
│  │            │ │ ▸ Q1?      │ │ Tools:     │   │
│  │ • Use 1    │ │   A1       │ │ → VTT→SRT  │   │
│  │ • Use 2    │ │ ▸ Q2?      │ │ → SRT→ASS  │   │
│  │ • Use 3    │ │   A2       │ │            │   │
│  │            │ │            │ │ Guides:    │   │
│  │            │ │            │ │ → SRT vs   │   │
│  │            │ │            │ │   VTT      │   │
│  └────────────┘ └────────────┘ └────────────┘   │
│                                                  │
│  [FUTURE AD SLOT]                                │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER                                          │
└─────────────────────────────────────────────────┘
```

**Tool Page Design Details:**

- **Header area:** White background, eyebrow + h1 + description + trust badges. Compact — takes up ~20vh max. User should see the workspace within the first scroll.
- **Workspace:** Full-width dark container (--color-workspace-bg). Two-column grid inside. Input on left, output on right. Both have their own mini-header (title + hint).
- **Workspace width:** Extends to --max-width (1200px), creating a "stage" for the tool.
- **Below workspace:** Background shifts to --color-muted. Three-column info grid with Use Cases, FAQ, and Related content.
- **FAQ in accordion:** Click to expand answers, not all open at once.
- **Related section:** Links to related tools (with format badges) and related guides.

**Input Panel Detail:**
- Tab bar (Upload / Paste) at top
- Dropzone or textarea below
- "Load Sample" and "Clear" buttons
- For Time Shifter: shift input field appears between input and output

**Output Panel Detail:**
- "Output" title + processing hint
- Readonly textarea
- "Copy" and "Download" buttons
- Output file name display

### 7.4 Guide Detail Page (/guides/[slug])

```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  [eyebrow: SUBTITLE GUIDE]                       │
│  SRT vs VTT: Which Subtitle                     │
│  Format Should You Use?                          │
│                                                  │
│  Published Jan 15, 2026 · 5 min read             │
│  ─────────────────────────────────               │
│                                                  │
│  TL;DR — For web video, VTT is the better       │
│  choice. For offline editing and broad           │
│  compatibility, SRT remains the standard.        │
│                                                  │
│  [Try: SRT to VTT Converter →]                   │
│                                                  │
│  ── Main Article Content ──────────────────────  │
│  │                                              │
│  │  h2, h3, p, ul, ol, code blocks, tables     │
│  │  Prose width: --max-width-narrow (760px)     │
│  │  Comfortable reading experience              │
│  │                                              │
│  ──────────────────────────────────────────────  │
│                                                  │
│  [FUTURE MID-ARTICLE AD SLOT]                    │
│                                                  │
│  ──────────────────────────────────────────────  │
│  │                                              │
│  │  ... continued article content ...           │
│  │                                              │
│  ──────────────────────────────────────────────  │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │  RELATED TOOL                                │ │
│  │  Try the SRT to VTT Converter →              │ │
│  │  Free • No signup • Browser-local            │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐ │
│  │ Related Guide 1     │ │ Related Guide 2     │ │
│  │ ...                 │ │ ...                 │ │
│  └─────────────────────┘ └─────────────────────┘ │
│                                                  │
├─────────────────────────────────────────────────┤
│  FOOTER                                          │
└─────────────────────────────────────────────────┘
```

**Guide Page Design Details:**

- **Article header:** White background. Eyebrow + h1 + date/meta + horizontal rule. Max-width: narrow (760px).
- **TL;DR block:** Below the header, a highlighted summary box (accent-light background, left border in accent). Gives immediate answer for SEO and scannability.
- **Tool CTA:** Below TL;DR, a linked call-to-action to the most relevant tool. Not a big banner — a subtle, contextual text link with arrow.
- **Prose area:** Clean typographic layout. Headings, paragraphs, lists, code blocks, tables. No sidebars.
- **Mid-article ad slot:** After ~40% of content, a natural content break. Empty div with reserved space for future AdSense.
- **Related Tool CTA:** After article, a card-style block linking to the most relevant tool. Dark accent background, white text, "Try the [tool name] →" with trust badges.
- **Related Guides:** 2-column grid of related guide cards.
- **No hero images.** No featured image at top. No blog-template artifacts.

**Prose Styling:**
```
h2: text-2xl, weight 700, --space-12 margin-top, --space-4 margin-bottom
h3: text-xl, weight 600, --space-8 margin-top, --space-3 margin-bottom
p: text-base, --space-6 margin-bottom
ul/ol: text-base, --space-4 margin-bottom, --space-4 padding-left
li: --space-2 margin-bottom
code (inline): --color-accent-light bg, --color-accent text, --radius-sm, padding 2px 6px
pre (block): --color-workspace-bg bg, --radius-md, padding --space-6, monospace
blockquote: left border 3px --color-accent, padding-left --space-6, italic, --color-secondary
table: full width, --color-subtle borders, alternating row backgrounds
a: --color-accent, underline, hover: --color-accent-hover
```

---

## 8. Responsive Breakpoints

```
--bp-sm:  640px   (mobile landscape)
--bp-md:  768px   (tablet portrait)
--bp-lg:  1024px  (tablet landscape / small desktop)
--bp-xl:  1280px  (desktop)
```

**Key responsive rules:**

1. **Workspace:** Two-column on desktop, single-column on mobile (input above output, stacked)
2. **Tool grid:** 3 cols → 2 cols → 1 col
3. **Guide prose:** Always single-column, max-width narrows on mobile
4. **Navigation:** Full nav on desktop, hamburger or scroll on mobile
5. **Hero:** text-6xl on desktop, text-4xl on tablet, text-3xl on mobile
6. **Info grid (tool page):** 3 cols → 1 col

---

## 9. Interaction & Motion

### Transitions
```
--duration-fast:   150ms  (hover states, focus rings)
--duration-normal: 200ms  (card hover, tab switches)
--duration-slow:   300ms  (page transitions, accordion)
--ease: cubic-bezier(0.4, 0, 0.2, 1)
```

### Micro-interactions

- **Card hover:** translate-y(-2px) + shadow-md, 200ms
- **Button hover:** darken 10% + translate-y(-1px), 150ms
- **Tab switch:** background crossfade, 150ms
- **Dropzone drag-over:** border becomes solid accent, background becomes accent-light
- **Copy button feedback:** text changes to "Copied!" with checkmark, reverts after 1.5s
- **Accordion:** max-height transition, 300ms
- **No scroll animations.** No parallax. No intersection observer reveals. Static site, instant rendering.

---

## 10. Ad Placement Strategy (Future)

Reserve space now, implement later. All placements use a `.ad-slot` div with:

```
min-height: 90px
background: --color-muted
border: 1px dashed --color-subtle
text-align: center
/* In production: replace with actual ad code */
```

**Placements:**

| Page | Position | Type | Notes |
|---|---|---|---|
| Homepage | Between "Why" and "Guides" sections | Content break | Natural pause between trust content and guides |
| Tool page | Below info grid (after FAQ) | Lower sponsor | Below the fold, doesn't compete with workspace |
| Guide page | Mid-article (after ~40% content) | In-article | Standard AdSense position, proven effective |

---

## 11. Implementation Notes

### Font Loading Strategy

```astro
<!-- In BaseHead -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Or self-host via Astro's built-in font system for performance.

### CSS Variable Migration

Replace the current `:root` in `global.css` with the new token system. The RGB-triplet pattern (`--accent: 9, 95, 247`) should be abandoned in favor of direct hex/rgb values since we're using CSS custom properties properly:

```css
:root {
  /* Colors — use direct values, not RGB triplets */
  --color-base: #0A0E1A;
  --color-surface: #FFFFFF;
  /* ... etc */
}
```

### Layout Architecture

Create a single `SiteLayout.astro` that all pages use (including homepage). Currently homepage, tools index, and guides index all manually compose Header + main + Footer. A shared layout ensures consistency and reduces duplication.

```
SiteLayout.astro:
  <Header />
  <main><slot /></main>
  <Footer />
```

### SVG Logo

Design a new SVG favicon/logo that uses the indigo accent color and the subtitle-timeline motif:

```
┌─────────────────┐
│  ━━━━━━━━━━     │   ← caption line 1 (accent color)
│  ━━━━━━         │   ← caption line 2 (shorter, muted)
│  ━━━━━━━━       │   ← caption line 3 (medium)
│          │      │   ← timeline cursor (accent, vertical)
└─────────────────┘
```

Keep the existing SVG structure but update colors to use `--color-accent` (#4F46E5) and refine the shapes.

### What NOT to Change

- Tool processing logic (processor.ts, catalog.ts)
- Client-side interactivity in ToolWorkbench
- Content collection structure
- SEO metadata approach
- RSS/sitemap setup
- Astro configuration (no new integrations needed)

---

## 12. Design Tokens Summary (Quick Reference)

```css
:root {
  /* Colors */
  --color-base: #0A0E1A;
  --color-surface: #FFFFFF;
  --color-muted: #F4F5F7;
  --color-subtle: #E8EAED;
  --color-secondary: #6B7280;
  --color-tertiary: #9CA3AF;

  --color-accent: #4F46E5;
  --color-accent-hover: #4338CA;
  --color-accent-light: #EEF2FF;
  --color-accent-muted: #C7D2FE;

  --color-success: #059669;
  --color-warning: #D97706;
  --color-danger: #DC2626;

  --color-workspace-bg: #1E1E2E;
  --color-workspace-text: #CDD6F4;
  --color-workspace-muted: #585B70;
  --color-workspace-border: #313244;
  --color-workspace-input: #181825;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', ui-monospace, monospace;

  /* Spacing */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem; --space-5: 1.25rem; --space-6: 1.5rem;
  --space-8: 2rem; --space-10: 2.5rem; --space-12: 3rem;
  --space-16: 4rem; --space-20: 5rem; --space-24: 6rem;

  /* Layout */
  --max-width: 1200px;
  --max-width-narrow: 760px;

  /* Radius */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --radius-xl: 20px; --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(10, 14, 26, 0.05);
  --shadow-md: 0 2px 8px rgba(10, 14, 26, 0.08);
  --shadow-lg: 0 8px 24px rgba(10, 14, 26, 0.12);
}
```
