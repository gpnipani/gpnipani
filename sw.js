const CACHE_NAME = 'gpnipani-pwa-v76';
const CORE_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './master-login.html',
  './committees.html',
  './aaple-sarkar.html',
  './panchayat-samiti.html',
  './village-officials.html',
  './sample-forms.html',
  './schemes.html',
  './tax-payment.html',
  './budget.html',
  './directory.html',
  './gallery.html',
  './custom-section.html',
  './banner-maker.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;
  if (url.includes('firebasedatabase.app') || url.includes('cloudinary.com')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
