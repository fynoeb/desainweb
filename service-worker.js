const CACHE_NAME = 'fayi-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/offline.html',
  '/icon192.png',  
  '/icon512.png'
];

// Install event untuk caching assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event untuk melayani permintaan dan cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log('Fetching:', event.request.url);
      return response || fetch(event.request).catch(function() {
        return caches.match('/offline.html');
      });
    })
  );
});

// Activate event untuk menghapus cache lama
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
