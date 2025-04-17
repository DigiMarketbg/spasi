
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Проверяваме дали OneSignal е зареден
    if (window.OneSignal) {
      try {
        window.OneSignal.push(() => {
          console.log("OneSignal инициализиран успешно");
          setIsInitialized(true);
          
          // Проверка на статуса на абонамента
          window.OneSignal.getNotificationPermission((permission) => {
            console.log("Текущи разрешения за известия:", permission);
          });
          
          window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
            console.log("Push notifications активирани:", isEnabled);
            setIsSubscribed(isEnabled);
          });
          
          // Добавяме слушател за промени в статуса
          window.OneSignal.on('subscriptionChange', function(isSubscribed) {
            console.log("Статус на абонамента променен:", isSubscribed);
            setIsSubscribed(isSubscribed);
            
            if (isSubscribed) {
              window.OneSignal.getUserId((userId) => {
                console.log("OneSignal User ID:", userId);
              });
            }
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
    
    setIsLoading(true);
    
    try {
      if (!isSubscribed) {
        // Регистриране за известия
        window.OneSignal.push(() => {
          console.log("Опит за регистрация за известия");
          
          // Изрично регистриране и активиране на известията
          window.OneSignal.registerForPushNotifications();
          window.OneSignal.setSubscription(true);
          
          // Обновяваме статуса след кратко забавяне
          setTimeout(() => {
            window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
              setIsSubscribed(isEnabled);
              setIsLoading(false);
              
              if (isEnabled) {
                // Запазваме ID на потребителя за проследяване
                window.OneSignal.getUserId((userId) => {
                  console.log("Потребител регистриран с ID:", userId);
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
          }, 1500);
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
      console.error("Грешка при промяна на абонамента:", error);
      setIsLoading(false);
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
