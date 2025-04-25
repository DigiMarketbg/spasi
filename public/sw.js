
// Cache name - update version to force refresh
const CACHE_NAME = 'spasi-bg-v14';

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

// Message Handler - for communication with main thread
self.addEventListener('message', (event) => {
  console.log('🟢 Service Worker: received message', event.data);
  
  if (event.data && event.data.type === 'PAGE_LOADED') {
    console.log('🟢 Service Worker: page loaded');
    // You can perform additional tasks here when the page is loaded
  }
});

// Service Worker handling of push notifications
self.addEventListener('push', function(event) {
  console.log('🟢 Service Worker: push notification received:', event);
  
  try {
    // Let OneSignal handle the push event if it's from OneSignal
    if (event.data) {
      const data = event.data.text();
      console.log('🟢 Push data:', data);
      
      if (data.includes('onesignal') || data.includes('OneSignal')) {
        console.log('🟢 OneSignal push event detected, letting OneSignal handle it');
        return;
      }
      
      // If not from OneSignal, we could handle it ourselves
      // This is a fallback if needed in the future
    }
  } catch (error) {
    console.error('🔴 Error processing push event:', error);
  }
});

// Service Worker handling of notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('🟢 Service Worker: notification clicked:', event);
  
  // Close the notification
  event.notification.close();
  
  // Store the notification data if available
  const notificationData = event.notification.data || {};
  console.log('🟢 Notification data:', notificationData);
  
  // This looks to see if the current is open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function(clientList) {
      // If we have a URL to navigate to (from notification data)
      const urlToOpen = notificationData.url || '/';
      
      // Check if a window client is already open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window client is open or no matching URL, open a new one
      return clients.openWindow(urlToOpen);
    })
  );
});

// Handle notification close events
self.addEventListener('notificationclose', function(event) {
  console.log('🟢 Service Worker: notification closed', event);
});

// Handle errors that might occur during push events
self.addEventListener('error', function(event) {
  console.error('🔴 Service Worker Error:', event.error);
});
