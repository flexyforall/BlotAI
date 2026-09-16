/* ==========================================================================
   Blot — Lobby screen
   Figma: 00UpjDezeR9WRlZXc7DVxb  node 700:1173

   NOTE ON ASSETS
   The art is served from Figma's export CDN, whose URLs expire about 7 days
   after export. To make the demo permanent, run:

       ./assets/fetch-assets.sh

   which downloads every file into assets/img/, then flip USE_LOCAL_ASSETS
   below to true. Nothing else has to change.
   ========================================================================== */

const USE_LOCAL_ASSETS = false;

const REMOTE = {
  bgEffects : 'https://www.figma.com/api/mcp/asset/2dc7c1de-f714-40d1-868b-88450a0ee530.png',
  sprite    : 'https://www.figma.com/api/mcp/asset/eb16137d-ddd1-4b76-b898-03ac5cc83a82.png',
  settings  : 'https://www.figma.com/api/mcp/asset/896ab890-8703-490d-bc5c-c834737bc4d5.png',
  cardBg    : 'https://www.figma.com/api/mcp/asset/1c03b6f3-53aa-4789-a5cd-d182fc11e2d2.png',
  charTrain : 'https://www.figma.com/api/mcp/asset/864d4644-13bd-4fe4-8e0b-2fde7c9abe90.png',
  sheen     : 'https://www.figma.com/api/mcp/asset/889640fa-4e29-4f82-b8ec-35fb2d465fdd.png',
  heroOnline: 'https://www.figma.com/api/mcp/asset/db983fd6-2fef-403c-a054-536ac4c540b0.png',
  friendsA  : 'https://www.figma.com/api/mcp/asset/a8a8094b-91a2-441f-97a4-b34a19e0f5aa.png',
  friendsB  : 'https://www.figma.com/api/mcp/asset/c9fd0808-f64e-4c36-8d19-58654616e450.png',
  avatar    : 'https://www.figma.com/api/mcp/asset/7e4fcc6b-eec9-48c7-b550-8b599b5d6061.png',
  rank2     : 'https://www.figma.com/api/mcp/asset/01f0b234-33d2-46cc-a0e5-016ce4677643.png',
  xpFill    : 'https://www.figma.com/api/mcp/asset/7741a76a-7f5e-4d34-87b7-965084437242.png',
  levelBadge: 'https://www.figma.com/api/mcp/asset/f40bd0b4-63da-466d-ba7d-e6256527b485.png',
  ellipses  : 'https://www.figma.com/api/mcp/asset/d7af6e0c-f902-493a-8b86-640caab6a339.svg',
  maskCard  : 'https://www.figma.com/api/mcp/asset/d1f168a1-7148-4347-ba19-2e7704e24305.svg',
  ellipsesA : 'https://www.figma.com/api/mcp/asset/c0ab5105-b2cd-45d8-886e-ec9953298093.svg',
  ellipsesB : 'https://www.figma.com/api/mcp/asset/c7a363d2-9c19-44cb-a003-9227525ff837.svg',
  glint     : 'https://www.figma.com/api/mcp/asset/0cacb3fd-974a-4b33-ac8f-e0719136df50.svg',
  hairline  : 'https://www.figma.com/api/mcp/asset/2f7bebbe-291b-46ea-87d5-ccd47d2e57f7.svg',
};

/* Local copies live at assets/img/<key>.<png|svg>, matching fetch-assets.sh. */
const A = Object.fromEntries(Object.entries(REMOTE).map(([key, url]) => [
  key,
  USE_LOCAL_ASSETS ? `assets/img/${key}.${url.endsWith('.svg') ? 'svg' : 'png'}` : url,
]));

/* Every image, keyed by its Figma node id, so the markup stays declarative. */
const BY_NODE = {
  '707:3614': A.bgEffects,
  '700:1536': A.cardBg,      '700:1537': A.charTrain,   '700:1539': A.ellipses,
  '700:1771': A.ellipsesA,   '700:1778': A.ellipsesB,
  '700:1786': A.ellipsesA,   '700:1793': A.ellipsesB,
  '700:1801': A.ellipsesA,   '700:1808': A.ellipsesB,
  '700:1784': A.sheen,       '700:1796': A.heroOnline,
  '700:1818': A.glint,       '700:1819': A.hairline,    '700:1831': A.hairline,
  '700:1821': A.cardBg,      '700:1822': [A.friendsA, A.friendsB], '700:1824': A.ellipses,
  '700:1518': A.avatar,      '700:1522': A.rank2,
  '700:1525': A.xpFill,      '700:1526': A.levelBadge,
};

/* Sprite-sheet crops (Figma percentages, relative to each icon's own box). */
const CROPS = {
  ghost  : { left:-426.45, top: -216.31, width:580.65, height:1452.48 },
  noads  : { left:-426.45, top: -216.31, width:580.65, height:1452.48 },
  energy : { left:-257.14, top:-1226.17, width:584.42, height:1374.50 },
  coin   : { left:-260.53, top: -192.81, width:592.11, height:1338.56 },
  daily  : { left: -85.81, top:-1121.23, width:580.65, height:1402.74 },
  quests : { left:-276.71, top: -978.91, width:616.44, height:1600.00 },
  rewards: { left:-423.72, top:-1152.11, width:576.92, height:1442.25 },
};

/* -------------------------------------------------------------------------
   Wire assets into the markup
   ------------------------------------------------------------------------- */

for (const [nodeId, src] of Object.entries(BY_NODE)) {
  const host = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (!host) continue;

  const targets = host.tagName === 'IMG' ? [host] : [...host.querySelectorAll('img')];
  const sources = Array.isArray(src) ? src : [src];
  targets.forEach((img, i) => { img.src = sources[i] ?? sources[0]; });

  /* the three ellipse layers inside the Play Online card are masked to it */
  if (host.classList.contains('masked') || host.classList.contains('online__sheen')) {
    host.style.maskImage = host.style.webkitMaskImage = `url("${A.maskCard}")`;
  }
}

/* sprite-sheet icons: one sheet, seven crops */
document.querySelectorAll('img[data-crop]').forEach(img => {
  const c = CROPS[img.dataset.crop];
  img.src = A.sprite;
  img.style.left   = c.left   + '%';
  img.style.top    = c.top    + '%';
  img.style.width  = c.width  + '%';
  img.style.height = c.height + '%';
});

/* the invisible spacer icons inside each tab use the same sheet */
document.querySelectorAll('.tab__ico-ghost img').forEach(img => {
  const c = CROPS.ghost;
  img.src = A.sprite;
  img.style.left   = c.left   + '%';
  img.style.top    = c.top    + '%';
  img.style.width  = c.width  + '%';
  img.style.height = c.height + '%';
});

/* settings glyph is its own export, not part of the sheet */
document.querySelector('.ico-settings').src = A.settings;

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

/* keep the CTA's 3px "press" travel on touch, where :active is unreliable */
const btn = document.querySelector('.btn');
const press   = () => btn.classList.add('is-pressed');
const release = () => btn.classList.remove('is-pressed');
document.querySelector('.card--online').addEventListener('pointerdown', press);
addEventListener('pointerup', release);
addEventListener('pointercancel', release);
