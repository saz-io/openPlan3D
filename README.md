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

**PDF export**

- **Your name on the PDF.** The title block shows a name you choose, with a line under it that defaults to "Created by <name>" (leave it empty to hide it), instead of upstream's openplan3d.com branding. Each export asks for both and remembers your answers in the browser.
- **Cleaner layout.** One page with a redesigned title block (project, date, name). The Room Schedule pages, the automatic wall length labels and the "Units" line are gone. Dimension lines and measurements you draw are kept; room names and areas still show.
- **No automatic compass.** A compass appears only if you place one (below).

**Compass object**

- Click **Compass** in the Build panel to place a four-pointed star in a ring with N, S, E and W labels.
- Rotate it with **Rotation (°)** in the Properties panel to point at true north; **Font Size** resizes it, **Color** recolours it, and each of the four labels can be edited (for example "Norte").
- It is drawn in the editor, PNG, PDF, SVG and DXF exports. Rotation is by typing an angle; there is no drag handle.

**Wall thickness**

- **Settings → Dimensions → Wall thickness** sets the thickness of new walls (default 15 cm; shown in inches in imperial projects; up to 100 cm). It is saved in the browser, so it applies to every project.
- **Apply to all walls** sets every existing wall on every floor to that thickness in one undo step. Existing walls otherwise keep their own thickness, which you can still change per wall in the Properties panel.

**Drawing walls to an exact length**

- **Feet, not inches.** After the first click, type a length and press Enter. In imperial projects a bare number is **feet** (`10` is 10 ft); `10'6`, `10'6"` and `6"` also work. In metric projects a bare number is cm; `3m` and `250cm` work too.
- **Exact length box (optional, off by default).** Turn on **Exact length** under Draw Wall in the Build panel, or press **L** with the wall tool. After the first click a small box appears next to the start point with **Feet / Inches** fields (metres / cm in metric). Tab switches field, Enter places the wall along your cursor's direction, Esc clears it.
- **Snap step.** **Settings → Dimensions → Snap step** (1", 3", 6", 1' or 1, 5, 10, 25 cm). While drawing, the wall's *length* snaps to the step, so lengths grow in clean steps. Switching units resets a preset step to the default for the new units (25 cm or 6").

Where to look in the code: the PDF title block is in `renderPDF` in [`src/lib/utils/export.ts`](src/lib/utils/export.ts) (default name: `DEFAULT_DESIGNER`); the compass is in [`src/lib/utils/compassGeometry.ts`](src/lib/utils/compassGeometry.ts); the thickness setting is `wallThickness` in [`src/lib/stores/settings.ts`](src/lib/stores/settings.ts); typed and boxed wall lengths are parsed in [`src/lib/utils/drawnLength.ts`](src/lib/utils/drawnLength.ts).

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

To export a PDF: draw at least one wall, then use **Export → PDF** in the top bar (or the command palette). Enter the name and the line under it when asked.

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
