# Blot — Lobby demo

The Blot mobile lobby screen, rendered inside an iPhone mockup.

Open `index.html` in a browser. No build step, no dependencies.

## What this is

A 1:1 implementation of the Lobby frame from Figma
([node `736:402`](https://www.figma.com/design/00UpjDezeR9WRlZXc7DVxb/Blot?node-id=736-402)),
sitting inside a landscape iPhone frame (Dynamic Island on the left rail, home
indicator on the right, volume/power rails on the outer edges).

The game frame is **852 × 393** — landscape, matching the Figma artboard. Every
coordinate in `assets/lobby.css` is written in those units and the whole device
is scaled as a unit via the `--s` custom property, so it fits any viewport
without the layout reflowing. Elements carry their `data-node-id`, so anything
on screen can be traced back to the design.

| | |
|---|---|
| `index.html` | markup — each element carries its `data-node-id` from Figma |
| `assets/lobby.css` | all layout and styling, in Figma coordinates |
| `assets/lobby.js` | asset wiring, viewport fit, interactions |
| `assets/img/` | the art the page actually loads |
| `assets/figma-exports/` | the raw Figma SVG exports these were derived from |
| `assets/fetch-assets.sh` | downloads the few assets not exported yet |

## Interactions

- Clicking **Training Game** or **Play with Friends** moves the highlight to
  that card and dims Play Online.
- **Play Now** has a press travel, driven by pointer events so it works on touch.
- Dock icons lift on hover.

## Assets

`assets/figma-exports/` holds the SVGs exported from Figma. They embed their
source bitmaps at full resolution — a 1254 × 1254 PNG for a 42px coin, 37 MB
across 22 files — so `assets/img/` holds the same files with every embedded
raster resampled to 2× its on-screen size. **37 MB → 3.7 MB, and no geometry
was touched**: only the base64 payloads were swapped, so every transform, mask,
filter and crop is byte-for-byte the designer's.

Two of those exports needed handling beyond resampling:

- `charactes + background.svg` is the whole Play Online art group. The
  character is not in it — in Figma he sits *between* its second and third mask
  groups. It is split into `online-art-under.svg` and `online-art-over.svg` at
  exactly that boundary, so the lower shadow ellipses still fall in front of
  him.
- Several exports bake in their own effects — `card-bg.svg` carries its
  opacity, `char-training.svg` its inner shadow, `rank2.svg` / `badge-gem.svg` /
  `badge-coin.svg` their rotations, `avatar.svg` the silver frame mask. Those
  are deliberately not re-applied in CSS.

### Nine assets are still remote

The background glow, the vignette, the two side-card glows, the two hairline
strokes and the settings gear were not among the exports, so they load from
Figma's CDN. **Those URLs expire about a week after export.**

`assets/lobby.js` looks in `assets/img/` first, falls back to the CDN, and
hides the layer if both fail — so the page degrades quietly rather than showing
broken images. To go fully offline:

```sh
./assets/fetch-assets.sh     # downloads them into assets/img/
```

Nothing to switch on afterwards. If the URLs have already expired, re-export
node `736:402` and either update the `PENDING` map in `assets/lobby.js` or drop
the layers into `assets/img/` under the filenames that map lists.

## Known gaps

- Only the lobby is built — the cards do not navigate anywhere yet.
- The header stats (`No ads`, `156`, `3,458`) and the level bar are static, as
  designed.
- `assets/figma-exports/` is 37 MB and nothing loads from it; it is kept only
  as the source of truth for `assets/img/`. Safe to delete if you have the
  Figma file.
