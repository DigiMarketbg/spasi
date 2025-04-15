
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if OneSignal is loaded
    if (window.OneSignal) {
      window.OneSignal.push(() => {
        window.OneSignal.isPushNotificationsEnabled().then((isEnabled) => {
          setIsSubscribed(isEnabled);
        });
      });
    }
  }, []);
  
  const handleSubscription = () => {
    if (!window.OneSignal) {
      toast({
        title: "Грешка",
        description: "Услугата за известия не е налична в момента.",
        variant: "destructive",
      });
      return;
    }
    
    window.OneSignal.push(() => {
      if (!isSubscribed) {
        window.OneSignal.registerForPushNotifications();
        window.OneSignal.setSubscription(true);
        
        toast({
          title: "Успешно абониране",
          description: "Сега ще получавате известия за нови спешни сигнали.",
        });
      } else {
        window.OneSignal.setSubscription(false);
        
        toast({
          title: "Отписване",
          description: "Вече няма да получавате известия.",
        });
      }
    });
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleSubscription}
      className="bg-white/10 hover:bg-white/20 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2"
    >
      <Bell className="h-5 w-5" />
      <span>{isSubscribed ? 'Отписване от известия' : 'Абониране за известия'}</span>
    </Button>
  );
};

export default NotificationButton;
