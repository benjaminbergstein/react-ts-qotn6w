var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
self.addEventListener("activate", (_event) => { });
self.addEventListener("install", (event) => {
    event.waitUntil(caches.open("mysite-dynamic").then(function (cache) {
        return cache.addAll([
            "/v1/tune",
            "/v1/playlist",
            "/v1/authorize",
            "/v1/quiz",
        ]);
    }));
});
self.addEventListener("fetch", (event) => __awaiter(this, void 0, void 0, function* () {
    return;
    event.respondWith(caches.open("mysite-dynamic").then(function (cache) {
        return cache.match(event.request).then(function (response) {
            return (response ||
                fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                }));
        });
    }));
}));
