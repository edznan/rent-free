# RentFree

*Display name: **RentFree**. Code identifier: `rent-free` (package name, service-worker cache).*

A CV builder that runs entirely in the browser. No backend, no build step, no
dependencies — the whole app is plain static files.

## Deploy

The deployable artifact is the **`public/`** folder, and that is all of it.
Everything uses relative paths, so it works at a domain root and under a
sub-path alike.

**Cloudflare Pages** — recommended: no base-path quirks, a free custom domain,
and instant cache purging.

- Build command: *(none)*
- Output directory: `public`

**GitHub Pages** — also works as-is. For a project site
(`https://user.github.io/<repo>/`) push the contents of `public/` to the
`gh-pages` branch (or point Pages at `/public` via a workflow). The relative
paths and the hash-based router mean no base-path configuration is needed.

Two things to check on your host:

- Serve `.webmanifest` as `application/manifest+json`, or the install prompt
  can be refused.
- Serve over HTTPS. Service workers (offline support, installability) only run
  on HTTPS or `localhost`.

## Viewing it locally

Open `public/` with any static file server — the app itself needs nothing else:

```bash
cd public && python3 -m http.server 5173     # → http://localhost:5173
npx serve public                             # or any other static server
```

Use a server rather than opening `index.html` from disk: service workers and the
PDF print path both expect `http://`, not `file://`.

## Before you publish

Fill in the values at the top of `public/content.js`:

| Key | Used for |
| --- | --- |
| `maker` | operator name on the legal pages |
| `email` | contact address on About/Contact/Privacy/Terms |
| `supportUrl` | Ko-fi / Buy Me a Coffee link (empty = hidden) |
| `paypal` | PayPal.me handle or URL (empty = hidden) |
| `bank` | bank details line (empty = hidden) |
| `githubUrl` | repo link (empty = hidden) |
| `updated` | "last changed" date on the legal pages |

With no donation channel set, the Support page shows a short "not published
yet" note instead of a button.

## How it fits together

| File | Role |
| --- | --- |
| `index.html` | the whole app: router, screens, styles |
| `i18n.js` | UI strings in English + Bosnian, plus plural rules (1 CV / 2 CV-a / 5 CV-ova) |
| `content.js` | long-form pages (privacy, terms, about, support) and the site identity above |
| `template.js` | the 18 CV templates: resume data in, standalone A4 HTML out |
| `sw.js` | service worker: offline shell, CDN caching |
| `manifest.webmanifest` | installability |
| `icons/` | app icons (see below) |
| `logo.png` | source logo, kept for reference — it is **not** deployed |
| `templates/` | the source .docx designs the ATS First set was modelled on — not deployed |

**PDF export** uses the browser's own print dialog. The CV templates are already
A4 (`@page { size: A4; margin: 0 }`), so "Save as PDF" produces exactly what the
preview shows — no library and no server involved.

**Language** is one setting (Settings → Language) that drives both the interface
and the section headings printed on the CV. English is the default; Bosnian is
the second option, and the choice is remembered. Strings live in `i18n.js`
(`t(lang, key)` / `tn(lang, key, n)`), long-form pages in `content.js`.

**Storage** is the browser's `localStorage` only: resumes under `rr:resume:*`,
their index under `rr:resumes`, settings under `rr:settings`. Nothing lives on a
server — Account → Export all writes a JSON file if you want a backup.

## Templates

**18 templates, one data model.** A template only changes **presentation** — the
same resume object is handed to whichever is selected, so switching never loses
or rewrites anything.

They are grouped into three optimisation targets. These are not a ranking: each
is a different thing to optimise for.

| Group | Tag | Optimised for |
| --- | --- | --- |
| `ats` | ATS First | compatibility with structured recruiting systems |
| `human` | Human First | visual scanning by recruiters and hiring managers |
| `hybrid` | Hybrid | a balance of structured parsing and visual reading |

### ATS First — six single-column layouts

Modelled on the documents in `templates/`, so the output matches their look:
plain top-to-bottom reading order, no icons, no graphics carrying meaning.

| Template | Character |
| --- | --- |
| **Classic** | letter-spaced caps name, no rules anywhere |
| **Precise** | centred header with an accent rule, thin rules per section, dates right-aligned |
| **Executive** | large centred name, grey caps headings |
| **Uncluttered** | sentence-case headings, airy spacing, 4-column skills |
| **Editorial** | left-aligned serif name, ruled headings, wide margins |
| **Expressive** | oversized serif name, centred caps headings |

These six define their own typography (Carlito, Open Sans, Cormorant Garamond —
the fonts of the source documents) so the result matches what you supplied. The
other twelve follow the font chosen in Settings.

### Human First — six two-column layouts

One sidebar layout in six treatments: sidebar colour, photo shape, decorative
shape, icon style, and where the name sits.

**Sidebar** · **Accent** · **Airy** · **Portrait** · **Midnight** · **Bold**

### Hybrid — six single-column layouts with more visual structure

Structured like ATS, but with the hierarchy of a human-first layout: tinted
header bands, accented headings, label/value contact blocks, ruled sections.

**Blend** · **Frame** · **Atlas** · **Meridian** · **Slate** · **Tower**

### Choosing one

- **Before you start:** tapping **+** (or *Create your resume*) opens the chooser
  first. Picking a card opens the editor with that template.
- **While you work:** on the **Preview** screen, the button under the header
  shows the current template and toggles the chooser open. Picking one re-renders
  the preview immediately and closes the panel.

The choice is stored per resume (`resume.template`), so different resumes can
target different audiences. Resumes saved before templates existed default to
**Human First → Sidebar**, which is the look they already had; the older values
`ats` / `human` / `ai` are mapped onto `ats-classic` / `human-sidebar` /
`hybrid-blend`.

`TEMPLATES` in `template.js` also carries internal `scores`
(`{ ats, human, hybrid }`) for future filtering. They are never shown to users.

### How it is put together

Two parameterised builders cover all 18, so a new template is a preset rather
than a renderer:

| Builder | Used by | What the style object controls |
| --- | --- | --- |
| `singleColumn(v, S)` | ATS First, Hybrid | page padding, header band or frame, name/role/contact typography, heading rules, entry layout, skills mode |
| `twoColumn(v, S)` | Human First | sidebar colours and width, photo shape and ring, decorative shape, icon style, where the name goes, skills as grid or chips |

To add a template: copy a preset, change its values, register it in `TEMPLATES`
with a `type`, a user-facing `name`, a `descKey` pointing at an i18n string and
`scores`, and add its id to `TEMPLATE_ORDER`. The chooser, the preview and the
print path all read the registry.

## Icons

`public/icons/` holds the four icons the manifest and `index.html` reference:

| File | Size | Notes |
| --- | --- | --- |
| `icon-192.png` | 192×192 | `any` — the tile's rounded corners are kept |
| `icon-512.png` | 512×512 | `any` |
| `icon-maskable-512.png` | 512×512 | `maskable` — full-bleed, artwork inside the safe zone |
| `apple-touch-icon.png` | 180×180 | fully opaque (iOS renders transparency as black) |

They were generated from `logo.png`, which is a rounded-square tile: the `any`
icons are the logo scaled to cover a square, while the maskable and Apple icons
are the central 82% of it scaled up, because an OS mask may cut the outer 10%
and neither platform wants transparency there.

If you replace the logo, regenerate all four by hand to those dimensions.
