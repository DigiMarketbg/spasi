
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client'

// Make Supabase available globally
window.supabase = supabase;

// OneSignal integration helper
const setupOneSignalHelpers = () => {
  // Добавяме помощна функция за проверка на статуса
  if (window.OneSignal) {
    console.info("Настройка на OneSignal помощници...");
    
    // Проверяваме статуса на инициализацията
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (window.OneSignal) {
          window.OneSignal.push(() => {
            window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
              console.log("OneSignal статус при зареждане:", isEnabled ? "Активен" : "Неактивен");
            });
          });
        }
      }, 2000);
    });
  }
};

// Add cache busting mechanism
const addCacheBusting = () => {
  // Add a version query parameter to all fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Only add cache-busting to same-origin requests
    const url = input instanceof Request ? input.url : String(input);
    const isSameOrigin = url.startsWith(window.location.origin) || url.startsWith('/');
    
    if (isSameOrigin && !url.includes('socket') && !url.includes('onesignal')) {
      const separator = url.includes('?') ? '&' : '?';
      const cacheBuster = `v=${new Date().getTime()}`;
      
      if (input instanceof Request) {
        // Create a new request with the modified URL
        const modifiedUrl = `${url}${separator}${cacheBuster}`;
        const newRequest = new Request(modifiedUrl, input);
        return originalFetch.call(this, newRequest, init);
      } else {
        // Modify the URL string
        const modifiedUrl = `${url}${separator}${cacheBuster}`;
        return originalFetch.call(this, modifiedUrl, init);
      }
    }
    
    return originalFetch.call(this, input, init);
  };
};

// Apply cache busting if not in development mode
if (import.meta.env.PROD) {
  addCacheBusting();
}

// Setup OneSignal helpers
setupOneSignalHelpers();

createRoot(document.getElementById("root")!).render(<App />);
