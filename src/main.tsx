
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client'

// Make Supabase available globally
window.supabase = supabase;

// OneSignal integration helper with improved error handling and diagnostics
const setupOneSignalHelpers = () => {
  if (!window.OneSignal) {
    console.warn("OneSignal not found. Push notifications will not be available.");
    return;
  }

  console.info("Setting up OneSignal helpers...");
  
  // Check the initialization status with better error handling
  window.addEventListener('load', () => {
    let attempts = 0;
    const checkOneSignalReady = setInterval(() => {
      attempts++;
      
      if (!window.OneSignal) {
        console.warn("OneSignal object not found during check");
        if (attempts >= 20) {
          console.error("OneSignal not available after multiple checks");
          clearInterval(checkOneSignalReady);
        }
        return;
      }
      
      if (typeof window.OneSignal.push === 'function') {
        console.log("OneSignal SDK found, checking initialization");
        
        window.OneSignal.push(() => {
          try {
            console.log("OneSignal SDK loaded and ready");
            
            // Check browser compatibility
            window.OneSignal.isPushNotificationsSupported((isSupported) => {
              if (!isSupported) {
                console.warn("Push notifications are not supported in this browser");
                return;
              }
              
              // Check if notifications are enabled
              window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
                console.log("OneSignal subscription status:", isEnabled ? "Active" : "Inactive");
                
                // Store subscription state for component access
                localStorage.setItem('onesignal_subscription', isEnabled ? 'true' : 'false');
                
                // Get OneSignal playerId (subscriber ID) if subscribed
                if (isEnabled) {
                  window.OneSignal.getUserId((userId) => {
                    console.log("OneSignal User ID:", userId);
                    localStorage.setItem('onesignal_user_id', userId);
                  });
                }
              });
            });
          } catch (error) {
            console.error("Error during OneSignal initialization check:", error);
          }
        });
        
        clearInterval(checkOneSignalReady);
      } else {
        console.log(`Waiting for OneSignal to be ready... (attempt ${attempts})`);
      }
      
      // Stop checking after 20 attempts (10 seconds)
      if (attempts >= 20) {
        console.warn("Failed to initialize OneSignal helper after multiple attempts");
        clearInterval(checkOneSignalReady);
      }
    }, 500);
  });
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

// Listen for notification permission changes
const listenForPermissionChanges = () => {
  try {
    // For modern browsers
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'notifications' }).then(permissionStatus => {
        console.log('Initial notification permission state:', permissionStatus.state);
        
        permissionStatus.onchange = () => {
          console.log('Notification permission state changed to:', permissionStatus.state);
        };
      });
    } else {
      console.log('Permission API not supported in this browser');
    }
  } catch (error) {
    console.error('Error setting up permission listeners:', error);
  }
};

// Apply cache busting if not in development mode
if (import.meta.env.PROD) {
  addCacheBusting();
}

// Setup permission change listeners
listenForPermissionChanges();

// Setup OneSignal helpers
setupOneSignalHelpers();

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
