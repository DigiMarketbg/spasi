
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();
  
  // Function to check OneSignal initialization status
  const checkOneSignalStatus = useCallback(() => {
    if (!window.OneSignal) {
      console.warn("OneSignal not available");
      setIsInitialized(false);
      setIsSupported(false);
      return false;
    }
    
    try {
      // Check if OneSignal is fully initialized and functions are available
      return typeof window.OneSignal.isPushNotificationsEnabled === 'function' &&
             typeof window.OneSignal.isPushNotificationsSupported === 'function';
    } catch (error) {
      console.error("Error checking OneSignal status:", error);
      return false;
    }
  }, []);
  
  // Function to check subscription status
  const checkSubscriptionStatus = useCallback(() => {
    if (!checkOneSignalStatus()) return;
    
    try {
      // First check if push notifications are supported by the browser
      window.OneSignal.isPushNotificationsSupported((isSupported) => {
        setIsSupported(isSupported);
        
        if (!isSupported) {
          console.warn("Push notifications not supported by this browser");
          toast({
            title: "Известията не се поддържат",
            description: "Вашият браузър не поддържа push известия.",
            variant: "destructive",
          });
          return;
        }
        
        // Then check if they are enabled
        window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
          console.log("OneSignal subscription status check:", isEnabled);
          setIsSubscribed(isEnabled);
          localStorage.setItem('onesignal_subscription', isEnabled ? 'true' : 'false');
        });
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при проверка на статуса на абонамента.",
        variant: "destructive",
      });
    }
  }, [toast, checkOneSignalStatus]);
  
  // Initialize OneSignal integration
  useEffect(() => {
    // Check first if OneSignal is loaded
    const checkInterval = setInterval(() => {
      if (checkOneSignalStatus()) {
        console.log("OneSignal is ready for initialization");
        setIsInitialized(true);
        clearInterval(checkInterval);
        
        // Now check the subscription status
        checkSubscriptionStatus();
        
        // Set up listener for subscription changes
        window.OneSignal.push(() => {
          window.OneSignal.on('subscriptionChange', function(isSubscribed) {
            console.log("Subscription status changed:", isSubscribed);
            setIsSubscribed(isSubscribed);
            
            // Update local storage
            localStorage.setItem('onesignal_subscription', isSubscribed ? 'true' : 'false');
            
            if (isSubscribed) {
              window.OneSignal.getUserId(function(userId) {
                console.log("OneSignal User ID:", userId);
                localStorage.setItem('onesignal_user_id', userId || '');
                
                toast({
                  title: "Успешно абониране",
                  description: "Вече ще получавате известия за важни събития.",
                });
              });
            } else {
              toast({
                title: "Отписване",
                description: "Вече няма да получавате известия.",
              });
              localStorage.removeItem('onesignal_user_id');
            }
          });
        });
      } else {
        console.log("Waiting for OneSignal to be ready...");
      }
    }, 1000);
    
    // Stop checking after 10 seconds to prevent infinite checks
    setTimeout(() => {
      clearInterval(checkInterval);
      
      if (!isInitialized) {
        console.error("OneSignal could not be initialized after timeout");
        setIsSupported(false);
      }
    }, 10000);
    
    // Check if we have cached subscription status
    const cachedStatus = localStorage.getItem('onesignal_subscription');
    if (cachedStatus) {
      setIsSubscribed(cachedStatus === 'true');
    }
    
    // Cleanup function
    return () => {
      clearInterval(checkInterval);
    };
  }, [checkOneSignalStatus, checkSubscriptionStatus]);
  
  // Handle subscription/unsubscription
  const handleSubscription = () => {
    if (!isInitialized || !isSupported) {
      toast({
        title: "Услугата не е налична",
        description: "Известията не са налични във вашия браузър или устройство.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!isSubscribed) {
        // Register for notifications
        window.OneSignal.push(function() {
          console.log("Attempting to register for notifications");
          
          // First check if notifications are already denied at browser level
          window.OneSignal.getNotificationPermission((permission) => {
            if (permission === 'denied') {
              console.warn("Notifications are blocked at browser level");
              toast({
                title: "Известията са блокирани",
                description: "Моля, разрешете известията в настройките на вашия браузър.",
                variant: "destructive",
              });
              setIsLoading(false);
              return;
            }
            
            // Show the native prompt
            window.OneSignal.showNativePrompt();
            
            // Also show the slidedown for better UX
            window.OneSignal.showSlidedownPrompt();
            
            // Check subscription status after a delay
            setTimeout(function() {
              window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                setIsSubscribed(isEnabled);
                setIsLoading(false);
                
                if (isEnabled) {
                  // Save user ID for tracking
                  window.OneSignal.getUserId(function(userId) {
                    console.log("User registered with ID:", userId);
                    localStorage.setItem('onesignal_user_id', userId || '');
                  });
                  
                  toast({
                    title: "Успешно абониране",
                    description: "Сега ще получавате известия за нови спешни сигнали.",
                  });
                } else {
                  toast({
                    title: "Внимание",
                    description: "Не успяхме да ви абонираме. Моля, проверете настройките на браузъра си за известия.",
                    variant: "destructive",
                  });
                }
              });
            }, 2000);
          });
        });
      } else {
        // Unsubscribe from notifications
        window.OneSignal.push(function() {
          console.log("Unsubscribing from notifications");
          window.OneSignal.setSubscription(false);
          localStorage.removeItem('onesignal_user_id');
          
          // Update status after a delay
          setTimeout(function() {
            window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
              setIsSubscribed(isEnabled);
              setIsLoading(false);
              
              toast({
                title: "Отписване",
                description: "Вече няма да получавате известия.",
              });
            });
          }, 1500);
        });
      }
    } catch (error) {
      console.error("Error changing subscription:", error);
      setIsLoading(false);
      toast({
        title: "Грешка",
        description: "Възникна проблем при обработката на заявката.",
        variant: "destructive",
      });
    }
  };
  
  const handleRepairPermission = () => {
    if (!isInitialized || !isSupported) return;
    
    try {
      window.OneSignal.push(function() {
        // This will attempt to repair a denied permission
        window.OneSignal.registerForPushNotifications();
      });
    } catch (error) {
      console.error("Error attempting to repair permission:", error);
    }
  };
  
  if (!isSupported) {
    return (
      <Button 
        variant="outline" 
        disabled
        className="bg-white/10 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2 opacity-50"
      >
        <Bell className="h-5 w-5" />
        <span>Известията не са поддържани</span>
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={handleSubscription}
      onDoubleClick={handleRepairPermission} // Hidden feature to attempt repair
      disabled={isLoading || !isInitialized}
      className="bg-white/10 hover:bg-white/20 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2"
    >
      <Bell className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
      <span>
        {isLoading ? 'Обработка...' : (isSubscribed ? 'Отписване от известия' : 'Абониране за известия')}
      </span>
    </Button>
  );
};

export default NotificationButton;
