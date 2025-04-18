// Cache name - update version to force refresh
const CACHE_NAME = 'spasi-bg-v13';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

console.log('🟢 Service Worker loaded, version:', CACHE_NAME);

// Install event
self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  console.log('🟢 Service Worker: installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🟢 Service Worker: caching static resources');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('🟢 Service Worker: activating...');
  
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🟢 Service Worker: clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // After activation, immediately update all clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'UPDATE_READY' }));
  });
});

// Fetch event - add network-first strategy for HTML and API requests
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and OneSignal requests
  if (event.request.method !== 'GET' || 
      event.request.url.includes('onesignal') || 
      event.request.url.includes('OneSignal')) {
    return;
  }
  
  // Check if this is a navigation request (HTML)
  const isNavigationRequest = event.request.mode === 'navigate';
  const isHTMLRequest = event.request.headers.get('accept')?.includes('text/html');
  const isAPIRequest = event.request.url.includes('/api/') || 
                      event.request.url.includes('supabase');
  
  // For HTML navigation or API requests, use network-first strategy
  if (isNavigationRequest || isHTMLRequest || isAPIRequest) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});

// Service Worker handling of push notifications
self.addEventListener('push', function(event) {
  console.log('🟢 Service Worker: push notification received:', event);
  
  // Let OneSignal handle the push event if it's from OneSignal
  if (event.data && event.data.text().includes('onesignal')) {
    console.log('🟢 OneSignal push event detected');
    return;
  }
  
  // Otherwise handle it ourselves
  if (self.registration.pushManager) {
    console.log('🟢 Push Manager is available');
    
    // You could implement custom notification handling here if needed
  }
});

// Service Worker handling of notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('🟢 Service Worker: notification clicked:', event);
  
  event.notification.close();
  
  // This looks to see if the current is open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      
      return clients.openWindow('/');
    })
  );
});
