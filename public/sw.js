/* Service worker — makes the app installable and fully usable offline.
   All paths are relative, so the app works at a domain root (Cloudflare Pages)
   and under a sub-path (GitHub Pages project site) alike. */

const VERSION = "rentfree-v1";
const SHELL = `${VERSION}-shell`;
const CDN = `${VERSION}-cdn`;

/* The app shell. Everything else (fonts, icons, styles) comes from CDNs. */
const SHELL_FILES = [
  "./",
  "./index.html",
  "./i18n.js",
  "./content.js",
  "./template.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
];

/* Vendored stylesheets + webfonts the resume preview and the UI need.
   Cached on first use rather than up front, so install stays fast. */
const CDN_HOSTS = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    /* Individually, so one missing file cannot fail the whole install. */
    await Promise.all(SHELL_FILES.map((url) =>
      cache.add(new Request(url, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable().catch(() => {});
    }
    await self.clients.claim();
  })());
});

/** Cache-first, then fill the cache in the background (stale-while-revalidate). */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    if (res && (res.ok || res.type === "opaque")) cache.put(request, res.clone());
    return res;
  } catch (err) {
    return hit || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  /* Navigations: network first so a new deploy is picked up, offline falls back
     to the cached shell. Hash routing means every route is this one document. */
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(SHELL);
        cache.put("./index.html", fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(SHELL);
        return (await cache.match("./index.html")) || (await cache.match("./")) || Response.error();
      }
    })());
    return;
  }

  /* Same-origin assets: cache first, refresh in the background. */
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(SHELL);
      const hit = await cache.match(request);
      const network = fetch(request).then((res) => {
        if (res && res.ok) cache.put(request, res.clone());
        return res;
      }).catch(() => null);
      return hit || (await network) || Response.error();
    })());
    return;
  }

  /* CDN stylesheets and webfonts: cache first so the app renders offline. */
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, CDN));
  }
});
