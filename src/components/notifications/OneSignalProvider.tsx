
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { OneSignalContext, OneSignalContextType } from './OneSignalContext';
import { isDevelopmentEnvironment, isProductionDomain, saveSubscriptionToDatabase } from './OneSignalUtils';
import { setupDevSimulation } from './OneSignalDevSimulator';

// Export the useOneSignal hook directly from the context file
export { useOneSignal } from './OneSignalContext';

export const OneSignalProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);

  // Initialize OneSignal
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
      
      // Check if user already subscribed in development
      const hasSubscribed = localStorage.getItem('onesignal_subscribed');
      if (hasSubscribed === 'true') {
        setIsSubscribed(true);
      }
      
      return;
    }

    if (!window.OneSignal) {
      console.warn('OneSignal SDK not loaded');
      // Setting initialized to true even if OneSignal is not available
      setIsInitialized(true);
      return;
    }

    const checkSubscriptionStatus = async () => {
      try {
        // Check if push notifications are supported
        const isPushSupported = await window.OneSignal.isPushNotificationsSupported();
        setIsPushSupported(isPushSupported);
        
        if (isPushSupported) {
          // Check if the user is subscribed
          const isPushEnabled = await window.OneSignal.isPushNotificationsEnabled();
          setIsSubscribed(isPushEnabled);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error checking OneSignal subscription:', error);
        setIsInitialized(true);
      }
    };

    // Add subscription change event listener using the push method
    try {
      window.OneSignal.push(() => {
        // Using on method instead of addEventListener
        window.OneSignal.on('subscriptionChange', async (isSubscribed: boolean) => {
          console.log('Subscription changed:', isSubscribed);
          setIsSubscribed(isSubscribed);
          
          if (isSubscribed) {
            const playerId = await window.OneSignal.getUserId();
            await saveSubscriptionToDatabase(playerId, user?.id, false);
          }
        });
        
        // Run the check
        checkSubscriptionStatus();
      });
    } catch (error) {
      console.warn('OneSignal initialization error:', error);
      setIsInitialized(true);
    }
    
    return () => {
      // Clean up OneSignal event listeners if needed
      if (window.OneSignal) {
        try {
          // Using off method instead of removeEventListener
          window.OneSignal.off('subscriptionChange');
        } catch (error) {
          console.warn('Error cleaning up OneSignal:', error);
        }
      }
    };
  }, [user?.id]);

  // Subscribe to push notifications
  const subscribe = async () => {
    if (isDevEnvironment) {
      console.log('DEV: Simulating subscription to push notifications');
      setIsSubscribed(true);
      localStorage.setItem('onesignal_subscribed', 'true');
      
      toast({
        title: 'Абонирани сте успешно',
        description: 'Ще получавате известия за нови сигнали',
      });
      
      return;
    }
    
    if (!window.OneSignal) {
      console.warn('OneSignal SDK not loaded');
      return;
    }
    
    try {
      await window.OneSignal.showNativePrompt();
      const isSubscribed = await window.OneSignal.isPushNotificationsEnabled();
      
      if (isSubscribed) {
        setIsSubscribed(true);
        const playerId = await window.OneSignal.getUserId();
        await saveSubscriptionToDatabase(playerId, user?.id, false);
        
        toast({
          title: 'Абонирани сте успешно',
          description: 'Ще получавате известия за нови сигнали',
        });
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      
      toast({
        title: 'Грешка',
        description: 'Не успяхме да ви абонираме за известия',
        variant: 'destructive',
      });
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async () => {
    if (isDevEnvironment) {
      console.log('DEV: Simulating unsubscription from push notifications');
      setIsSubscribed(false);
      localStorage.removeItem('onesignal_subscribed');
      
      toast({
        title: 'Отписани сте успешно',
        description: 'Няма да получавате повече известия',
      });
      
      return;
    }
    
    if (!window.OneSignal) {
      console.warn('OneSignal SDK not loaded');
      return;
    }
    
    try {
      await window.OneSignal.setSubscription(false);
      setIsSubscribed(false);
      
      toast({
        title: 'Отписани сте успешно',
        description: 'Няма да получавате повече известия',
      });
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      
      toast({
        title: 'Грешка',
        description: 'Не успяхме да ви отпишем от известия',
        variant: 'destructive',
      });
    }
  };

  const value: OneSignalContextType = {
    isSubscribed,
    isPushSupported,
    isInitialized,
    subscribe,
    unsubscribe,
  };

  return (
    <OneSignalContext.Provider value={value}>
      {children}
    </OneSignalContext.Provider>
  );
};
