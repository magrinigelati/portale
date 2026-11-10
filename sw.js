// Service worker minimo: serve solo a rendere il portale installabile come app.
// Non salva nulla in cache: la pagina viene sempre scaricata dal server.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
