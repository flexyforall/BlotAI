# Blot — Lobby demo

The Blot mobile lobby screen, rendered inside an iPhone mockup.

Open `index.html` in a browser. No build step, no dependencies.

## What this is

A 1:1 implementation of the Lobby frame from Figma
([node `700:1173`](https://www.figma.com/design/00UpjDezeR9WRlZXc7DVxb/Blot?node-id=700-1173)),
sitting inside a landscape iPhone frame (Dynamic Island on the left rail, home
indicator on the right, volume/power rails on the outer edges).

The game frame is **852 × 393** — landscape, matching the Figma artboard. Every
coordinate in `assets/lobby.css` is written in those units and the whole device
is scaled as a unit via the `--s` custom property, so it fits any viewport
without the layout reflowing.

| | |
|---|---|
| `index.html` | markup — each element carries its `data-node-id` from Figma |
| `assets/lobby.css` | all layout and styling, in Figma coordinates |
| `assets/lobby.js` | asset wiring, viewport fit, interactions |
| `assets/fetch-assets.sh` | downloads the art for offline use |

## Interactions

- Clicking **Training Game** or **Play with Friends** moves the highlight to
  that card and dims Play Online.
- **Play Now** has the designed 3px press travel, driven by pointer events so it
  also works on touch.
- Dock icons lift on hover.

## Assets

The art is served from Figma's export CDN. **Those URLs expire roughly 7 days
after export**, after which the screen will render as empty boxes.

To make it permanent:

```sh
./assets/fetch-assets.sh          # downloads all 18 files into assets/img/
```

then set `USE_LOCAL_ASSETS = true` at the top of `assets/lobby.js`.

If the URLs have already expired, re-export node `700:1173` from the Figma file
and replace the `REMOTE` map in `assets/lobby.js` with the fresh URLs.

## Known gaps

- Only the lobby is built — the cards do not navigate anywhere yet.
- The header stats (`No ads`, `58`, `3,458`), the level bar, and the `0/3` pill
  are static, as designed.
