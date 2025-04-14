
import { useState, useEffect } from 'react';
import { isDevelopmentEnvironment } from './OneSignalUtils';
import { setupDevSimulation } from './OneSignalDevSimulator';

interface UseOneSignalInitializationResult {
  isInitialized: boolean;
  isPushSupported: boolean;
  isDevEnvironment: boolean;
}

export const useOneSignalInitialization = (): UseOneSignalInitializationResult => {
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);

  useEffect(() => {
    // Check if we're in development environment
    const devMode = isDevelopmentEnvironment();
    setIsDevEnvironment(devMode);
    
    // In development, we'll simulate OneSignal functionality
    if (devMode) {
      console.log('Running in development mode: OneSignal simulation active');
      setupDevSimulation();
      setIsPushSupported(true);
      setIsInitialized(true);
      return;
    }

    if (!window.OneSignal) {
      console.warn('OneSignal SDK not loaded');
      // Setting initialized to true even if OneSignal is not available
      setIsInitialized(true);
      return;
    }

    // Add subscription change event listener using the push method
    try {
      window.OneSignal.push(() => {
        // Check if push notifications are supported
        window.OneSignal.isPushNotificationsSupported().then((isPushSupported: boolean) => {
          setIsPushSupported(isPushSupported);
          
          if (isPushSupported) {
            // Check if the user is subscribed
            window.OneSignal.isPushNotificationsEnabled().then((isPushEnabled: boolean) => {
              setIsInitialized(true);
            });
          } else {
            setIsInitialized(true);
          }
        }).catch((error: any) => {
          console.error('Error checking OneSignal support:', error);
          setIsInitialized(true);
        });
      });
    } catch (error) {
      console.warn('OneSignal initialization error:', error);
      setIsInitialized(true);
    }
  }, []);

  return { isInitialized, isPushSupported, isDevEnvironment };
};
