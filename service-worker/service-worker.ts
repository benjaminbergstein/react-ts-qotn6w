self.addEventListener("activate", (_event) => {});

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open("mysite-dynamic").then(function (cache) {
      return cache.addAll([
        "/v1/tune",
        "/v1/playlist",
        "/v1/authorize",
        "/v1/quiz",
      ]);
    })
  );
});

self.addEventListener("fetch", async (event: FetchEvent) => {
  return;
  event.respondWith(
    caches.open("mysite-dynamic").then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    })
  );
});
