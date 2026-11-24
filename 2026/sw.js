// Service worker : l'appli marche sans connexion et se met à jour toute seule.
// La liste des fichiers vient de js/fichiers.js.
importScripts('js/fichiers.js');
const C = 'avent-v12';
const CORE = ['./', 'index.html', 'js/fichiers.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon.svg', 'icon-anim.svg',
  ...FICHIERS.tete, ...FICHIERS.corps, ...FICHIERS.medias];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.pathname.endsWith('.mp4') || u.pathname.endsWith('version.json') || r.headers.has('range')) return;
  // pages et code : réseau d'abord (toujours la dernière version), le cache si pas de connexion
  if (r.mode === 'navigate' || /(\.html|\.js|\.css|\/)$/.test(u.pathname)) {
    e.respondWith(fetch(r.url, { cache: 'no-store', credentials: 'same-origin' })
      .then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(u.pathname, cp)); return res; })
      .catch(() => caches.match(u.pathname).then(m => m || caches.match(r, { ignoreSearch: true })).then(m => m || caches.match('index.html'))));
    return;
  }
  // images, sons… : le cache d'abord, mis à jour en arrière-plan
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => {
    const net = fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; }).catch(() => m);
    return m || net;
  }));
});
