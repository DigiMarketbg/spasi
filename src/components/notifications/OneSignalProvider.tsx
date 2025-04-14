
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

  // Initialize OneSignal
  useEffect(() => {
    if (!window.OneSignal) {
      console.warn('OneSignal SDK not loaded');
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
      }
    };

    // Add subscription change event listener
    window.OneSignal.push(() => {
      window.OneSignal.on('subscriptionChange', async (isSubscribed: boolean) => {
        console.log('Subscription changed:', isSubscribed);
        setIsSubscribed(isSubscribed);
        
        if (isSubscribed) {
          await saveSubscriptionToDatabase();
        }
      });
      
      checkSubscriptionStatus();
    });
    
    return () => {
      // Clean up OneSignal event listeners if needed
      if (window.OneSignal) {
        window.OneSignal.off('subscriptionChange');
      }
    };
  }, []);

  // Save subscription to database
  const saveSubscriptionToDatabase = async () => {
    try {
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
