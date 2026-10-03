# openPlan3D (saz fork)

**A free, open-source 2D/3D floor plan editor that runs in your browser.**

Draw a floor plan in the 2D editor, then switch to a navigable 3D view. Projects are stored on your device; no account is needed.

This is a personal fork of [laanlabs/openPlan3D](https://github.com/laanlabs/openPlan3D) (MIT). It adds the changes listed below and otherwise tracks upstream.

<p align="center">
  <img src="plan1_2d.jpg" alt="2D floor plan" width="48%">
  <img src="plan1_3d.jpg" alt="3D view" width="48%">
</p>

---

## What's different in this fork

PDF export has been customised:

- **Your name on the PDF.** The title block shows a name you choose ("Created by …") instead of upstream's openplan3d.com branding.
- **Name prompt.** Each PDF export asks for the name to show. Your last answer is remembered in the browser and offered as the default.
- **Compass.** A circle with N, S, E and W labels and a north arrow is drawn in the top-right corner of the plan page. North always points up the page; the editor has no north setting.

To change the default name, edit `DEFAULT_DESIGNER` in [`src/lib/utils/export.ts`](src/lib/utils/export.ts). The title block and compass drawing are in the same file, inside `renderPDF`.

---

## Quick start

You need [Node.js](https://nodejs.org) 24 (see `.nvmrc`) and npm.

```bash
git clone https://github.com/saz-io/openPlan3D.git
cd openPlan3D
npm ci
npm run dev
```

Open <http://localhost:5173>.

To export a PDF: draw at least one wall, then use **Export → PDF** in the top bar (or the command palette). Enter the name to show when asked.

### Production build

```bash
npm run build
npm run preview
```

### Checks

```bash
npm test          # unit tests
npm run check     # type check
npm run build
```

Browser tests (`npm run test:browser`) need Playwright browsers: `npx playwright install --with-deps chromium firefox webkit`. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Features

- **Drawing:** walls with snapping and angle constraints, doors and windows in many styles, straight/L/U stairs, and rooms auto-detected from walls.
- **Furniture:** a categorised catalogue with 3D models ([catalogue source](src/lib/utils/furnitureCatalog.ts)).
- **3D view:** real-time preview (`Tab`), first-person walkthrough, material and texture editor, adjustable lighting.
- **Editing tools:** snap to grid, smart guides, multi-select and alignment, layers, text annotations, undo/redo, and version history.
- **Export:** PDF, PNG, SVG, DXF, JSON, and project package ZIP ([format](docs/project-package-v1.md)).
- **Import:** JSON, Apple RoomPlan scans, project package ZIP, and pasted reference images.

Full capability list and known limits: [FEATURES.md](FEATURES.md).

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `V` / `W` / `D` / `T` | Select / wall / door / text tool |
| `H` | Pan |
| `R` | Rotate selected furniture |
| `Tab` | Toggle 2D / 3D |
| `Delete` / `Backspace` | Delete selection |
| `Escape` | Deselect / cancel |
| `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / redo |
| `Ctrl+S` | Save |

---

## Tech stack

[SvelteKit](https://svelte.dev), [Three.js](https://threejs.org), [Tailwind CSS](https://tailwindcss.com), TypeScript, [jsPDF](https://github.com/parallax/jsPDF) for PDFs, [dxf-writer](https://github.com/nicholaschiasson/dxf-writer) for DXF.

Firebase is used upstream for hosting and temporary iPhone handoffs. The editor and PDF export work locally without it. Handoff and assistant-share setup is documented in [docs/handoff-quotas.md](docs/handoff-quotas.md) and [docs/assistant-shares.md](docs/assistant-shares.md).

---

## Credits and license

Original project: [laanlabs/openPlan3D](https://github.com/laanlabs/openPlan3D), including its companion iOS scanning app and hosted version at [app.openplan3d.com](https://app.openplan3d.com/). This fork's changes are by [saz](https://github.com/saz-io).

Released under the [MIT License](LICENSE). The original copyright notice is kept as the license requires.
