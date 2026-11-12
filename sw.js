// Service worker del portale.
// - rende il portale installabile come app
// - tiene in cache SOLO le risorse fisse (libreria Supabase, icone, logo) per aprire piu' in fretta;
//   la pagina index.html e i dati vengono sempre scaricati dal server (mai in cache)
const CACHE = "portale-fisso-v1";
const FISSE = /supabase\.min\.js|icona-\d+\.png|apple-touch-icon\.png|favicon-32\.png|manifest\.json/;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !FISSE.test(e.request.url)) return;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const inCache = await c.match(e.request);
      const rete = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => inCache);
      return inCache || rete;   // prima la copia locale, intanto si aggiorna
    })
  );
});
