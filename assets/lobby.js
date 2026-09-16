/* ==========================================================================
   Blot — Lobby screen
   Figma: 00UpjDezeR9WRlZXc7DVxb  node 736:402

   ASSETS
   Most of the art is local, under assets/img/ — those are the uploaded Figma
   exports with their embedded rasters downscaled to 2x their display size
   (37 MB -> 3.7 MB; no geometry was touched, only the pixel payloads).

   REMOTE holds the eight pieces that were not exported yet. They load from
   Figma's CDN, whose URLs expire about a week after export, so the screen
   will lose its background glow, vignette, card glows, hairlines and the
   settings gear once they lapse. Export these from node 736:402 and drop
   them into assets/img/ to finish the offline set — see README.
   ========================================================================== */

const IMG = 'assets/img/';

/* Assets that were not exported yet. Each is tried locally first, then from
   Figma's CDN, then hidden — so dropping the file into assets/img/ is all it
   takes to go fully offline, and an expired URL degrades quietly instead of
   leaving a broken-image glyph on screen. `assets/fetch-assets.sh` downloads
   the whole set for you. */
const PENDING = {
  'bg-base.png'        : 'https://www.figma.com/api/mcp/asset/387030f1-6777-4b77-9922-a47b788672aa.png',
  'bg-glow.png'        : 'https://www.figma.com/api/mcp/asset/f1ed4361-3fae-4e94-a6e7-c0d6d6b749c8.png',
  'bg-glow-mask.png'   : 'https://www.figma.com/api/mcp/asset/e64bcccb-8655-47ff-81d7-32059207ca46.png',
  'vignette.svg'       : 'https://www.figma.com/api/mcp/asset/d74aedef-a207-4474-b29b-ca112e11ba32.svg',
  'glow-training.svg'  : 'https://www.figma.com/api/mcp/asset/d6ea3ea2-e84a-48e2-a6eb-67e74feb46d5.svg',
  'glow-friends.svg'   : 'https://www.figma.com/api/mcp/asset/d5a79385-2947-4a63-bfb8-6bac48791996.svg',
  'hairline-online.svg': 'https://www.figma.com/api/mcp/asset/4fea432f-50bf-44c7-9269-2f80269fdd25.svg',
  'hairline-friends.svg':'https://www.figma.com/api/mcp/asset/4795651d-1249-475f-853b-8753d7d4384c.svg',
  'ico-gear.svg'       : 'https://www.figma.com/api/mcp/asset/50264cd6-2a31-4c2f-9794-3e49dc639b07.svg',
};

/* Every image, keyed by its Figma node id, so the markup stays declarative. */
const BY_NODE = {
  '736:409': 'bg-base.png',
  '736:412': 'bg-glow.png',
  '736:414': 'vignette.svg',

  '736:429': 'card-bg.svg',
  '736:430': 'char-training.svg',
  '736:432': 'glow-training.svg',

  '736:440': 'online-art-under.svg',
  '736:472': 'online-hero.svg',
  '736:473': 'online-art-over.svg',
  '736:495': 'btn-play.svg',
  '736:496': 'hairline-online.svg',

  '736:498': 'card-bg.svg',
  '736:499': 'char-friends.svg',
  '736:501': 'glow-friends.svg',
  '736:508': 'hairline-friends.svg',

  '736:511': 'avatar.svg',
  '736:519': 'rank2.svg',
  '738:781': 'xp-fill.svg',

  '738:832': 'badge-crown.svg',
  '738:777': 'badge-gem.svg',
  '737:767': 'badge-coin.svg',
};

const GLYPHS = {
  users     : 'glyph-a.svg',
  clipboard : 'glyph-b.svg',
  ranking   : 'glyph-c.svg',
  sword     : 'ico-sword.svg',
  gear      : 'ico-gear.svg',
};

/* -------------------------------------------------------------------------
   Wire assets into the markup
   ------------------------------------------------------------------------- */

function setSrc(img, name) {
  const fallback = PENDING[name];
  img.addEventListener('error', function onError() {
    if (fallback && img.src.indexOf(fallback) === -1) img.src = fallback;
    else { img.removeEventListener('error', onError); img.style.display = 'none'; }
  });
  img.src = IMG + name;
}

for (const [nodeId, name] of Object.entries(BY_NODE)) {
  const host = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (!host) { console.warn('no element for node', nodeId); continue; }
  setSrc(host.tagName === 'IMG' ? host : host.querySelector('img'), name);
}

document.querySelectorAll('.tab__chrome').forEach(img => setSrc(img, `tab-chrome-${img.dataset.chrome}.svg`));
document.querySelectorAll('.dock__chrome').forEach(img => setSrc(img, 'dock-chrome.svg'));
document.querySelectorAll('.dock__glyph').forEach(img => setSrc(img, GLYPHS[img.dataset.glyph]));

/* The upper background layer is masked to the top 852x295 of the frame. A CSS
   mask has no error event, so resolve the URL with a probe before applying it. */
(function applyGlowMask() {
  const el = document.querySelector('.bg-fx__glow');
  const local = IMG + 'bg-glow-mask.png';
  const probe = new Image();
  probe.onload  = () => { el.style.maskImage = el.style.webkitMaskImage = `url("${local}")`; };
  probe.onerror = () => { el.style.maskImage = el.style.webkitMaskImage = `url("${PENDING['bg-glow-mask.png']}")`; };
  probe.src = local;
})();

/* -------------------------------------------------------------------------
   Fit the device to the viewport
   ------------------------------------------------------------------------- */

const device = document.getElementById('device');

function fit() {
  const pad = 32;
  const s = Math.min(
    (window.innerWidth  - pad) / device.offsetWidth,
    (window.innerHeight - pad) / device.offsetHeight
  );
  document.documentElement.style.setProperty('--s', String(Math.min(s, 1.35)));
}

fit();
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);

/* -------------------------------------------------------------------------
   Lobby interactions
   ------------------------------------------------------------------------- */

const modes = document.querySelector('.modes');

modes.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  modes.classList.remove('is-training', 'is-friends');
  if (card.dataset.mode !== 'online') modes.classList.add('is-' + card.dataset.mode);
});

/* keep the CTA's press travel on touch, where :active is unreliable */
const btn = document.querySelector('.btn');
const press   = () => btn.classList.add('is-pressed');
const release = () => btn.classList.remove('is-pressed');
document.querySelector('.card--online').addEventListener('pointerdown', press);
addEventListener('pointerup', release);
addEventListener('pointercancel', release);
