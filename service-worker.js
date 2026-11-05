// Game PWA cache version. Online navigation and executable data use network-first.
const CACHE_NAME = "tk-front-rear-formation-20261105-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./scenario-engine.js",
  "./enemy_rounds_01_20.json",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./faces/shu.webp",
  "./faces/wei.webp",
  "./faces/wu.webp",
  "./faces/other.webp",
  "./faces/enemy.webp",
  "./faces/portraits.json",
  "./MAIN.png",
  "./MAP_BG.png",
  "./faces/enemy/가후관도.webp",
  "./faces/enemy/가후군웅.webp",
  "./faces/enemy/견초.webp",
  "./faces/enemy/고람.webp",
  "./faces/enemy/고순군웅.webp",
  "./faces/enemy/고순동탁.webp",
  "./faces/enemy/공도.webp",
  "./faces/enemy/공손찬관도.webp",
  "./faces/enemy/곽가관도.webp",
  "./faces/enemy/곽사군웅.webp",
  "./faces/enemy/곽사동탁.webp",
  "./faces/enemy/관우관도.webp",
  "./faces/enemy/관해.webp",
  "./faces/enemy/국의.webp",
  "./faces/enemy/도겸.webp",
  "./faces/enemy/동탁동탁.webp",
  "./faces/enemy/문추관도.webp",
  "./faces/enemy/미축관도.webp",
  "./faces/enemy/서영.webp",
  "./faces/enemy/성렴.webp",
  "./faces/enemy/송헌.webp",
  "./faces/enemy/순우경.webp",
  "./faces/enemy/심배.webp",
  "./faces/enemy/안량관도.webp",
  "./faces/enemy/여포군웅.webp",
  "./faces/enemy/여포동탁.webp",
  "./faces/enemy/왕윤.webp",
  "./faces/enemy/우금군웅.webp",
  "./faces/enemy/우보.webp",
  "./faces/enemy/원담.webp",
  "./faces/enemy/원상.webp",
  "./faces/enemy/원소관도.webp",
  "./faces/enemy/원술관도.webp",
  "./faces/enemy/원술군웅.webp",
  "./faces/enemy/위속.webp",
  "./faces/enemy/위월.webp",
  "./faces/enemy/유벽.webp",
  "./faces/enemy/유비관도.webp",
  "./faces/enemy/유요.webp",
  "./faces/enemy/유훈.webp",
  "./faces/enemy/이각군웅.webp",
  "./faces/enemy/이각동탁.webp",
  "./faces/enemy/이유.webp",
  "./faces/enemy/장각.webp",
  "./faces/enemy/장개.webp",
  "./faces/enemy/장량.webp",
  "./faces/enemy/장료군웅.webp",
  "./faces/enemy/장료동탁.webp",
  "./faces/enemy/장보.webp",
  "./faces/enemy/장비관도.webp",
  "./faces/enemy/장수.webp",
  "./faces/enemy/장제.webp",
  "./faces/enemy/장합관도.webp",
  "./faces/enemy/저수관도.webp",
  "./faces/enemy/전위관도.webp",
  "./faces/enemy/전풍.webp",
  "./faces/enemy/조조관도.webp",
  "./faces/enemy/주준.webp",
  "./faces/enemy/진궁군웅.webp",
  "./faces/enemy/진등.webp",
  "./faces/enemy/태사자군웅.webp",
  "./faces/enemy/하후돈군웅.webp",
  "./faces/enemy/하후연관도.webp",
  "./faces/enemy/허공.webp",
  "./faces/enemy/허유.webp",
  "./faces/enemy/호진.webp",
  "./faces/enemy/화웅동탁.webp",
  "./faces/enemy/황건적_졸개.webp",
  "./faces/enemy/황조.webp"
];
const CACHE_PREFIXES = ['three-kingdoms-', 'tk-battle-', 'tk-enemy-', 'tk-'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache every bundled file; an unavailable optional asset must not block SW activation.
    await Promise.all(CORE_ASSETS.map(async asset => {
      try { const response = await fetch(new Request(asset, {cache:'reload'}));
        if (response.ok) await cache.put(asset, response);
      } catch (error) { console.warn('[PWA] precache skipped', asset); }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME && CACHE_PREFIXES.some(p => k.startsWith(p))).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname.toLowerCase();
  const isDoc = request.mode === 'navigate' || request.destination === 'document';
  const isCode = /\.(?:html?|js|json|webmanifest)$/.test(path) || path.endsWith('/service-worker.js');
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (isDoc || isCode) {
      // Never serve a stale script or HTML while connected.
      try {
        const live = await fetch(new Request(request, {cache:'no-store'}));
        if (live.ok) {
          await cache.put(request, live.clone());
          return live;
        }
        throw new Error('HTTP '+live.status);
      } catch (error) {
        return (await cache.match(request, {ignoreSearch:true})) ||
               (isDoc ? await cache.match('./index.html') : undefined) ||
               Response.error();
      }
    }
    const cached = await cache.match(request, {ignoreSearch:true});
    if (cached) return cached;
    try {
      const live = await fetch(request);
      if (live.ok) await cache.put(request, live.clone());
      return live;
    } catch (error) { return Response.error(); }
  })());
});
