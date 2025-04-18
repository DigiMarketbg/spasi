
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if OneSignal is loaded
    if (window.OneSignal) {
      try {
        window.OneSignal.push(function() {
          console.log("Checking OneSignal initialization status");
          
          // Ensure initialization is complete before checking subscription
          const checkInitialization = setInterval(() => {
            // Check if OneSignal SDK is fully initialized
            if (typeof window.OneSignal.isPushNotificationsEnabled === 'function') {
              clearInterval(checkInitialization);
              setIsInitialized(true);
              
              // Check subscription status
              window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                console.log("Push notifications enabled:", isEnabled);
                setIsSubscribed(isEnabled);
              });
              
              // Add listener for subscription changes
              window.OneSignal.on('subscriptionChange', function(isSubscribed) {
                console.log("Subscription status changed:", isSubscribed);
                setIsSubscribed(isSubscribed);
                
                if (isSubscribed) {
                  window.OneSignal.getUserId(function(userId) {
                    console.log("OneSignal User ID:", userId);
                  });
                }
              });
            } else {
              console.log("Waiting for OneSignal to initialize...");
            }
          }, 1000);
          
          // Clear interval after 10 seconds to prevent infinite checking
          setTimeout(() => clearInterval(checkInitialization), 10000);
        });
      } catch (error) {
        console.error("Error initializing OneSignal:", error);
      }
    }
  }, []);
  
  const handleSubscription = () => {
    if (!window.OneSignal || !isInitialized) {
      toast({
        title: "Грешка",
        description: "Услугата за известия не е налична в момента. Моля, опитайте отново по-късно.",
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
          
          // Show the native prompt
          window.OneSignal.showSlidedownPrompt();
          
          // Check subscription status after a brief delay
          setTimeout(function() {
            window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
              setIsSubscribed(isEnabled);
              setIsLoading(false);
              
              if (isEnabled) {
                // Save user ID for tracking
                window.OneSignal.getUserId(function(userId) {
                  console.log("User registered with ID:", userId);
                });
                
                toast({
                  title: "Успешно абониране",
                  description: "Сега ще получавате известия за нови спешни сигнали.",
                });
              } else {
                toast({
                  title: "Внимание",
                  description: "Моля, разрешете известията в браузъра си.",
                });
              }
            });
          }, 2000);
        });
      } else {
        // Unsubscribe from notifications
        window.OneSignal.push(function() {
          console.log("Unsubscribing from notifications");
          window.OneSignal.setSubscription(false);
          
          // Update status after a brief delay
          setTimeout(function() {
            window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
              setIsSubscribed(isEnabled);
              setIsLoading(false);
              
              if (!isEnabled) {
                toast({
                  title: "Отписване",
                  description: "Вече няма да получавате известия.",
                });
              }
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
  
  return (
    <Button 
      variant="outline" 
      onClick={handleSubscription}
      disabled={isLoading}
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
