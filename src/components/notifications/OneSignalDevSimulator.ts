
// This file provides simulation of OneSignal in development environments

// Set up dev environment simulation for OneSignal
export const setupDevSimulation = (): void => {
  // Check if OneSignal is already defined globally
  if (window.OneSignal) {
    console.log('OneSignal already defined, not setting up dev simulation');
    return;
  }
  
  console.log('Setting up OneSignal development simulation');
  
  // Simulate OneSignal in development
  window.OneSignal = {
    // Basic simulation
    isPushNotificationsSupported: async () => true,
    isPushNotificationsEnabled: async () => {
      const hasSubscribed = localStorage.getItem('onesignal_subscribed');
      return hasSubscribed === 'true';
    },
    
    // Event management
    _eventListeners: {},
    addEventListener: function(event: string, listener: Function) {
      if (!this._eventListeners[event]) {
        this._eventListeners[event] = [];
      }
      this._eventListeners[event].push(listener);
    },
    removeEventListener: function(event: string) {
      this._eventListeners[event] = [];
    },
    
    // Trigger events
    _triggerEvent: function(event: string, data: any) {
      if (this._eventListeners[event]) {
        this._eventListeners[event].forEach((listener: Function) => listener(data));
      }
    },
    
    // User management
    getUserId: async () => 'dev-player-id-' + Math.random().toString(36).substring(2, 9),
    
    // Subscription management
    showNativePrompt: async () => {
      console.log('DEV: Showing simulated native prompt');
      localStorage.setItem('onesignal_subscribed', 'true');
      if (window.OneSignal._eventListeners['subscriptionChange']) {
        window.OneSignal._triggerEvent('subscriptionChange', true);
      }
      return true;
    },
    
    setSubscription: async (value: boolean) => {
      console.log(`DEV: Setting subscription to ${value}`);
      localStorage.setItem('onesignal_subscribed', value ? 'true' : 'false');
      if (window.OneSignal._eventListeners['subscriptionChange']) {
        window.OneSignal._triggerEvent('subscriptionChange', value);
      }
      return true;
    },
    
    // Legacy support for push function
    push: (callback: Function | any[]) => {
      if (typeof callback === 'function') {
        callback(window.OneSignal);
      }
    }
  };
  
  // Define the deferred array if it doesn't exist
  if (!window.OneSignalDeferred) {
    window.OneSignalDeferred = [];
  }
  
  // Process any deferred callbacks
  window.OneSignalDeferred.forEach((callback: Function) => {
    if (typeof callback === 'function') {
      callback(window.OneSignal);
    }
  });
  
  // Clear the deferred array
  window.OneSignalDeferred = [];
};

// Add global type definition for our simulator
declare global {
  interface Window {
    OneSignal: {
      isPushNotificationsSupported: () => Promise<boolean>;
      isPushNotificationsEnabled: () => Promise<boolean>;
      addEventListener: (event: string, listener: Function) => void;
      removeEventListener: (event: string) => void;
      _eventListeners: Record<string, Function[]>;
      _triggerEvent: (event: string, data: any) => void;
      getUserId: () => Promise<string>;
      showNativePrompt: () => Promise<boolean>;
      setSubscription: (value: boolean) => Promise<boolean>;
      push: (callback: Function | any[]) => void;
    };
    OneSignalDeferred: any[];
  }
}
