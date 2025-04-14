
// Cache name - update version to force refresh
const CACHE_NAME = 'spasi-bg-v5';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/lovable-uploads/8db7f922-f5d9-4a9a-a53a-f93967d704dd.png',
  '/lovable-uploads/67305523-c36e-48e8-b434-fbcbd7931232.png',
  '/lovable-uploads/9ebf9964-e102-4d6e-866b-63884dc1f10f.png'
];

// Install event
self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app resources');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Enhanced fetch strategy - stale-while-revalidate for most resources
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For HTML requests - network first with cache fallback
  if (event.request.mode === 'navigate' || 
      event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/');
            });
        })
    );
    return;
  }
  
  // For images and static assets - Cache first, then network (stale-while-revalidate)
  if (
    event.request.url.match(/\.(jpeg|jpg|png|gif|svg|webp|ico)$/) ||
    event.request.url.includes('/lovable-uploads/')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Return cached response immediately
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Update cache with new response
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              return networkResponse;
            })
            .catch(error => {
              console.log('Fetch failed:', error);
              // Return cached response as fallback
              return cachedResponse;
            });
            
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // For all other requests - stale-while-revalidate
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            return networkResponse;
          });
            
        return cachedResponse || fetchPromise;
      })
  );
});

// Function to clear all caches - can be called to force refreshes after deployment
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.action === 'clearCaches') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('All caches cleared successfully');
        // Notify the client that caches have been cleared
        if (event.source) {
          event.source.postMessage({
            action: 'cachesCleared',
            success: true
          });
        }
      })
    );
  }
});
