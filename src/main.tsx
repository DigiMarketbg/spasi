
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client'

// Дефинираме OneSignal типове за по-добра поддръжка
declare global {
  interface Window {
    supabase: typeof supabase;
    OneSignal: {
      initialized: boolean;
      init: (options: any) => Promise<void>;
      User: {
        PushSubscription: {
          id: string | null;
          optedIn: boolean;
          addEventListener: (event: string, callback: (event: any) => void) => void;
          removeEventListener: (event: string, callback: (event: any) => void) => void;
        }
      };
      isPushNotificationsSupported: () => Promise<boolean>;
      Slidedown: {
        promptPush: (options?: { force?: boolean, forceSlidedownOverNative?: boolean }) => Promise<any>;
      };
      getVersion: () => string;
      Debug: {
        setLogLevel: (level: string) => void;
      };
    };
    OneSignalDeferred: Array<(OneSignal: Window['OneSignal']) => void>;
  }
}

// Правим Supabase достъпен глобално за OneSignal интеграцията
window.supabase = supabase;

// Add cache busting mechanism
const addCacheBusting = () => {
  // Add a version query parameter to all fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Only add cache-busting to same-origin requests
    const url = input instanceof Request ? input.url : String(input);
    const isSameOrigin = url.startsWith(window.location.origin) || url.startsWith('/');
    
    // Пропускаме OneSignal заявки
    if (url.includes('onesignal')) {
      return originalFetch.call(this, input, init);
    }
    
    if (isSameOrigin && !url.includes('socket')) {
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

createRoot(document.getElementById("root")!).render(<App />);
