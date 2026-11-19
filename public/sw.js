const CACHE_NAME = "ingetec-offline-v1";
const APP_SHELL = ["/offline.html"];
const MAX_CACHED_ASSETS = 100;

async function storeResponse(request, response) {
  if (!response || !response.ok) return;

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());

  const keys = await cache.keys();
  if (keys.length > MAX_CACHED_ASSETS) {
    await Promise.all(keys.slice(0, keys.length - MAX_CACHED_ASSETS).map((key) => cache.delete(key)));
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith("ingetec-offline-") && name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        event.data.urls.map(async (path) => {
          try {
            const url = new URL(path, self.location.origin);
            if (url.origin !== self.location.origin || (await cache.match(url.href))) return;
            const response = await fetch(url.href, { credentials: "same-origin" });
            await storeResponse(url.href, response);
          } catch {
            // Ignore an optional resource that is unavailable while caching.
          }
        }),
      );
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          await storeResponse("/index.html", response);
          return response;
        })
        .catch(async () => (await caches.match("/offline.html")) || Response.error()),
    );
    return;
  }

  if (request.destination === "image") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          await storeResponse(request, response);
          return response;
        })
        .catch(async () => caches.match(request)),
    );
    return;
  }

  if (["script", "style", "font"].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then(async (response) => {
          await storeResponse(request, response);
          return response;
        }),
      ),
    );
  }
});
