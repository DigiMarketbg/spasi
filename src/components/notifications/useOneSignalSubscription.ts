
import { useState, useEffect } from 'react';
import { saveSubscriptionToDatabase } from './OneSignalUtils';
import { toast } from '@/hooks/use-toast';

interface UseOneSignalSubscriptionProps {
  isInitialized: boolean;
  isPushSupported: boolean;
  isDevEnvironment: boolean;
  userId?: string;
}

interface UseOneSignalSubscriptionResult {
  isSubscribed: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export const useOneSignalSubscription = ({
  isInitialized,
  isPushSupported,
  isDevEnvironment,
  userId
}: UseOneSignalSubscriptionProps): UseOneSignalSubscriptionResult => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check subscription status and set up event listener
  useEffect(() => {
    if (!isInitialized || !isPushSupported) {
      return;
    }

    // In development, check localStorage
    if (isDevEnvironment) {
      const hasSubscribed = localStorage.getItem('onesignal_subscribed');
      if (hasSubscribed === 'true') {
        setIsSubscribed(true);
      }
      return;
    }

    if (!window.OneSignal) {
      return;
    }

    // Check initial subscription status
    window.OneSignal.isPushNotificationsEnabled().then((isPushEnabled: boolean) => {
      setIsSubscribed(isPushEnabled);
    }).catch((error: any) => {
      console.error('Error checking subscription status:', error);
    });

    // Set up subscription change listener
    window.OneSignal.on('subscriptionChange', async (isSubscribed: boolean) => {
      console.log('Subscription changed:', isSubscribed);
      setIsSubscribed(isSubscribed);
      
      if (isSubscribed) {
        const playerId = await window.OneSignal.getUserId();
        await saveSubscriptionToDatabase(playerId, userId, false);
      }
    });

    return () => {
      // Clean up event listener
      if (window.OneSignal) {
        try {
          window.OneSignal.off('subscriptionChange');
        } catch (error) {
          console.warn('Error cleaning up OneSignal:', error);
        }
      }
    };
  }, [isInitialized, isPushSupported, isDevEnvironment, userId]);

  // Subscribe to push notifications
  const subscribe = async () => {
    console.log('Subscribe function called');
    
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
      console.log('Showing OneSignal slidedown prompt...');
      
      // This is the specific implementation for the button click
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal) {
        // Show the slidedown prompt directly
        await OneSignal.showSlidedownPrompt();
        console.log('Slidedown prompt shown via button click');
      });
      
      // Check subscription status after a short delay
      setTimeout(async () => {
        try {
          const isSubscribed = await window.OneSignal.isPushNotificationsEnabled();
          if (isSubscribed) {
            setIsSubscribed(true);
            const playerId = await window.OneSignal.getUserId();
            await saveSubscriptionToDatabase(playerId, userId, false);
            
            toast({
              title: 'Абонирани сте успешно',
              description: 'Ще получавате известия за нови сигнали',
            });
          }
        } catch (error) {
          console.error('Error checking subscription status after prompt:', error);
        }
      }, 2000);
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

  return { isSubscribed, subscribe, unsubscribe };
};
