self.addEventListener("install", e => {
    console.log("Install pwa!");
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./"])
        })
    )
});

self.addEventListener("fetch", e => {
    // console.log(`Intercepting fetch request for: ${e.request.url}`)
    e.respondWidth(
        caches.match(e.request).then(response => {
            return response || fetch(e.request)
        })
    )
})