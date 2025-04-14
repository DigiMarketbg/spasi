
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { OneSignalContext, OneSignalContextType } from './OneSignalContext';
import { useOneSignalInitialization } from './useOneSignalInitialization';
import { useOneSignalSubscription } from './useOneSignalSubscription';

// Export the useOneSignal hook directly from the context file
export { useOneSignal } from './OneSignalContext';

export const OneSignalProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  // Use our hooks to handle initialization and subscription
  const { isInitialized, isPushSupported, isDevEnvironment } = useOneSignalInitialization();
  const { isSubscribed, subscribe, unsubscribe } = useOneSignalSubscription({
    isInitialized,
    isPushSupported,
    isDevEnvironment,
    userId: user?.id
  });

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
