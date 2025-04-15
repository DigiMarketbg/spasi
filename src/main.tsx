
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client'

// Pravim Supabase dostupno globalno
window.supabase = supabase;

// Add cache busting mechanism
const addCacheBusting = () => {
  // Add a version query parameter to all fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Only add cache-busting to same-origin requests
    const url = input instanceof Request ? input.url : String(input);
    const isSameOrigin = url.startsWith(window.location.origin) || url.startsWith('/');
    
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
