
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

interface OneSignalContextType {
  isSubscribed: boolean;
  isPushSupported: boolean;
  isInitialized: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

const OneSignalContext = createContext<OneSignalContextType | undefined>(undefined);

export const useOneSignal = () => {
  const context = useContext(OneSignalContext);
  if (context === undefined) {
    throw new Error('useOneSignal must be used within a OneSignalProvider');
  }
  return context;
};

export const OneSignalProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);

  // Initialize OneSignal
  useEffect(() => {
    const isDev = () => {
      const host = window.location.hostname;
      return host.includes('localhost') || 
             host.includes('127.0.0.1') || 
             host.includes('lovableproject.com');
    };

    // Check if we're in development environment
    const devMode = isDev();
    setIsDevEnvironment(devMode);
    
    // In development, we'll simulate OneSignal functionality
    if (devMode) {
      console.log('Running in development mode: OneSignal simulation active');
      setIsPushSupported(true);
      setIsInitialized(true);
      
      // Check if we already showed the dialog before and user subscribed
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

    // Add subscription change event listener
    try {
      window.OneSignal.push(() => {
        // Using addEventListener instead of on/off pattern
        window.OneSignal.addEventListener('subscriptionChange', async (isSubscribed: boolean) => {
          console.log('Subscription changed:', isSubscribed);
          setIsSubscribed(isSubscribed);
          
          if (isSubscribed) {
            await saveSubscriptionToDatabase();
          }
        });
        
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
          // Using removeEventListener for cleanup
          window.OneSignal.removeEventListener('subscriptionChange');
        } catch (error) {
          console.warn('Error cleaning up OneSignal:', error);
        }
      }
    };
  }, []);

  // Save subscription to database
  const saveSubscriptionToDatabase = async () => {
    try {
      // In development, we just simulate
      if (isDevEnvironment) {
        console.log('DEV: Simulating saving subscription to database');
        return;
      }
      
      // Get OneSignal User ID (player_id)
      const playerId = await window.OneSignal.getUserId();
      
      if (!playerId) {
        console.error('No OneSignal player ID found');
        return;
      }
      
      // Save subscription to Supabase
      const { error } = await supabase.from('push_subscribers').upsert(
        {
          player_id: playerId,
          user_id: user?.id || null,
          // Default to empty for now, can be updated later
          city: null,
          category: null,
        },
        { onConflict: 'player_id' }
      );
      
      if (error) {
        console.error('Error saving subscription to database:', error);
        toast({
          title: 'Грешка',
          description: 'Не успяхме да запазим вашия абонамент',
          variant: 'destructive',
        });
      } else {
        console.log('Subscription saved to database successfully');
      }
    } catch (error) {
      console.error('Error in saveSubscriptionToDatabase:', error);
    }
  };

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
        await saveSubscriptionToDatabase();
        
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

  const value = {
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

// Add global type definition for OneSignal
declare global {
  interface Window {
    OneSignal: any;
    OneSignalDeferred: any[];
  }
}
