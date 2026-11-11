// Cambia la versión cada vez que actualices la app para que los dispositivos descarguen los archivos nuevos.
const VERSION = 'panel-to-v2';
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'fonts/fonts.css', 'fonts/AtkinsonHyperlegible-normal-400.woff2', 'fonts/AtkinsonHyperlegible-normal-700.woff2',
  'fonts/AtkinsonHyperlegible-italic-400.woff2', 'fonts/Fredoka-variable.woff2',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Página: primero la red (para recibir actualizaciones), si no hay internet usa la copia guardada.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
