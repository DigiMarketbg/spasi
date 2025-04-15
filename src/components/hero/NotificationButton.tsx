
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Проверяваме дали OneSignal е зареден
    if (window.OneSignal) {
      try {
        window.OneSignal.push(() => {
          // При успешна инициализация
          console.log("OneSignal инициализиран успешно");
          setIsInitialized(true);
          
          // Проверка на статуса на абонамента
          window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
            console.log("Push notifications статус:", isEnabled);
            setIsSubscribed(isEnabled);
          });
        });
      } catch (error) {
        console.error("Грешка при инициализация на OneSignal:", error);
      }
    }
  }, []);
  
  const handleSubscription = () => {
    if (!window.OneSignal || !isInitialized) {
      toast({
        title: "Грешка",
        description: "Услугата за известия не е налична в момента.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!isSubscribed) {
        // Регистриране за известия
        window.OneSignal.push(() => {
          console.log("Опит за регистрация за известия");
          window.OneSignal.registerForPushNotifications();
          window.OneSignal.setSubscription(true);
          
          // Обновяваме статуса след кратко забавяне
          setTimeout(() => {
            window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
              setIsSubscribed(isEnabled);
              if (isEnabled) {
                toast({
                  title: "Успешно абониране",
                  description: "Сега ще получавате известия за нови спешни сигнали.",
                });
              }
            });
          }, 1000);
        });
      } else {
        // Отписване от известия
        window.OneSignal.push(() => {
          console.log("Отписване от известия");
          window.OneSignal.setSubscription(false);
          
          // Обновяваме статуса след кратко забавяне
          setTimeout(() => {
            window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
              setIsSubscribed(isEnabled);
              if (!isEnabled) {
                toast({
                  title: "Отписване",
                  description: "Вече няма да получавате известия.",
                });
              }
            });
          }, 1000);
        });
      }
    } catch (error) {
      console.error("Грешка при промяна на абонамента:", error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при обработката на заявката за абонамент.",
        variant: "destructive",
      });
    }
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
