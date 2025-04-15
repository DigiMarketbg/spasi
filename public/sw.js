
// Cache name - update version to force refresh
const CACHE_NAME = 'spasi-bg-v10';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

console.log('🟢 Service Worker зареден, версия:', CACHE_NAME);

// Important: Load OneSignal's service worker BEFORE any other code
// This ensures the OneSignal SDK can properly handle push messages
console.log('🟢 Импортиране на OneSignal Service Worker');
self.importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

// Install event
self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  console.log('🟢 Service Worker: инсталиране...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🟢 Service Worker: кеширане на статични ресурси');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - add network-first strategy for HTML and API requests
self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request (HTML)
  const isNavigationRequest = event.request.mode === 'navigate';
  const isHTMLRequest = event.request.headers.get('accept')?.includes('text/html');
  const isAPIRequest = event.request.url.includes('/api/') || 
                      event.request.url.includes('supabase');
  
  // За OneSignal заявки, позволяваме директен достъп до мрежата
  if (event.request.url.includes('onesignal')) {
    console.log('🔔 OneSignal заявка, пропускаме към мрежата:', event.request.url);
    return;
  }
  
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

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('🟢 Service Worker: активиране...');
  
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🟢 Service Worker: изчистване на стар кеш', cacheName);
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

// Add event listener for push notifications
self.addEventListener('push', function(event) {
  try {
    console.log('🟢 Получено push съобщение', event);
    
    let data;
    try {
      data = event.data.json();
    } catch (e) {
      console.error('❌ Грешка при парсване на push данни:', e);
      data = {
        title: 'Ново съобщение',
        body: 'Получено е ново съобщение от Спаси БГ',
        url: '/'
      };
    }
    
    console.log('📦 Push данни:', data);
    
    const options = {
      body: data.body || 'Получено е ново съобщение от Спаси БГ',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: {
        url: data.url || '/'
      },
      // Add additional options for better notifications
      vibrate: [100, 50, 100],
      requireInteraction: true, // Keep the notification until dismissed
      tag: 'spasi-bg-notification', // Group notifications
      actions: [
        {
          action: 'open',
          title: 'Отвори'
        },
        {
          action: 'close',
          title: 'Затвори'
        }
      ]
    };

    console.log('🟢 Показване на известие:', data.title, options);
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Ново съобщение', options)
    );
  } catch (error) {
    console.error('❌ Грешка при обработка на push известие:', error);
    
    // Fallback notification if there's an error
    event.waitUntil(
      self.registration.showNotification('Ново съобщение', {
        body: 'Получено е ново съобщение от Спаси БГ',
        icon: '/icon-192.png'
      })
    );
  }
});

// Add event listener for notification click
self.addEventListener('notificationclick', function(event) {
  console.log('🟢 Известието е кликнато', event);
  
  event.notification.close();
  
  // Handle notification action buttons
  if (event.action === 'open' || !event.action) {
    // Open the URL if action is 'open' or if clicked on the notification body
    const urlToOpen = event.notification.data?.url || '/';
    console.log('🔗 Отваряне на URL:', urlToOpen);
    
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(function(clientList) {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.indexOf(urlToOpen) !== -1 && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close the notification, which already happened above
    console.log('🔴 Известието е затворено');
  }
});

