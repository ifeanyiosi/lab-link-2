self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("lab-link-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/offline.html",
        "/icons/lab-link-logo.png",
        // Add other critical assets here
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // For navigation requests, show the offline page if network fails
      if (event.request.mode === "navigate") {
        return caches.match("/offline.html");
      }

      // For other requests, try to return a cached response
      return caches.match(event.request);
    })
  );
});
