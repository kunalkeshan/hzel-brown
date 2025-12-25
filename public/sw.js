const CACHE_VERSION = 'v2';
const STATIC_CACHE = `hzel-brown-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `hzel-brown-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `hzel-brown-images-${CACHE_VERSION}`;

// Resources to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 60;

// Cache size management
const limitCacheSize = (cacheName, maxSize) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxSize) {
        // Delete oldest entries
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxSize));
      }
    });
  });
};

// Install service worker and cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (cacheName.startsWith('hzel-brown-') && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch with different strategies based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first for API/data requests (Sanity CMS, etc.)
  if (url.pathname.startsWith('/api/') || 
      url.hostname.includes('sanity.io') ||
      url.pathname.includes('/cms/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
              limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first for images
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Cache the image
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseClone);
              limitCacheSize(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for HTML pages and other resources
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Update cache with fresh content
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          const cacheName = request.destination === 'document' ? DYNAMIC_CACHE : STATIC_CACHE;
          caches.open(cacheName).then((cache) => {
            cache.put(request, responseClone);
            if (cacheName === DYNAMIC_CACHE) {
              limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
            }
          });
        }
        return networkResponse;
      }).catch(() => {
        // If network fails, return cached response if available
        return cachedResponse || new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });

      // Return cached response immediately, but also fetch fresh content
      return cachedResponse || fetchPromise;
    })
  );
});

// Handle messages from clients (for manual cache refresh)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('hzel-brown-')) {
              return caches.delete(cacheName);
            }
          })
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'CACHE_CLEARED' });
        });
      })
    );
  }
});
