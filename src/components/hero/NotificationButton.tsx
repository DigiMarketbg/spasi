
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

const NotificationButton = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Проверява състоянието на абонамента при зареждане на компонента
  useEffect(() => {
    checkSubscriptionStatus();
    
    // Добавяме глобален слушател за промени в абонамента
    if (window.OneSignal) {
      console.log("🟢 Настройваме OneSignal слушател при зареждане на NotificationButton");
      
      // Определяме функцията handleSubscriptionChange извън обработчика на събития
      const handleSubscriptionChange = async (event) => {
        try {
          console.log("🔄 Промяна в push абонамента", event);
          
          const isSubscribed = await window.OneSignal.User.PushSubscription.optedIn;
          const playerId = await window.OneSignal.User.PushSubscription.id;
          
          console.log(`🔔 Нов статус: ${isSubscribed ? 'абониран' : 'неабониран'}, ID: ${playerId || 'няма'}`);
          
          setIsSubscribed(isSubscribed);
          
          if (isSubscribed && playerId) {
            await saveSubscriptionToDatabase(playerId);
          }
        } catch (error) {
          console.error("❌ Грешка при обработка на промяна в абонамента:", error);
        }
      };
      
      // Добавяме слушател към PushSubscription
      window.OneSignal.User.PushSubscription.addEventListener('change', handleSubscriptionChange);
      
      // Почистваме при размонтиране
      return () => {
        if (window.OneSignal && window.OneSignal.User?.PushSubscription) {
          try {
            window.OneSignal.User.PushSubscription.removeEventListener('change', handleSubscriptionChange);
          } catch (error) {
            console.error("❌ Грешка при премахване на слушателя:", error);
          }
        }
      };
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      if (!window.OneSignal) {
        console.error("❌ OneSignal не е зареден");
        toast({
          title: "Системна грешка",
          description: "Известията не могат да бъдат инициализирани",
          variant: "destructive"
        });
        return;
      }

      // Проверка дали SDK е инициализиран
      if (!window.OneSignal.initialized) {
        console.log("⏳ Изчакваме OneSignal да се инициализира...");
        // Използваме deferred функция, за да изчакаме инициализацията
        window.OneSignalDeferred.push(async function() {
          await checkSubscriptionStatus();
        });
        return;
      }

      // Проверяваме дали потребителят е абониран
      const isPushSupported = await window.OneSignal.isPushNotificationsSupported();
      
      if (!isPushSupported) {
        console.log("⚠️ Push известията не се поддържат от този браузър");
        toast({
          title: "Непозволен браузър",
          description: "Този браузър не поддържа push известия",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      const isPushSubscriptionActive = await window.OneSignal.User.PushSubscription.optedIn;
      const playerId = await window.OneSignal.User.PushSubscription.id;
      
      setIsSubscribed(isPushSubscriptionActive);
      
      console.log(`🔔 Текущ статус на абонамента: ${isPushSubscriptionActive ? 'абониран' : 'неабониран'}`);
      console.log(`🆔 Player ID: ${playerId || 'няма'}`);
      
      // Ако е абониран, но нямаме записан ID, записваме го в Supabase
      if (isPushSubscriptionActive && playerId) {
        await saveSubscriptionToDatabase(playerId);
      }
      
      // Проверка на наличните разрешения за известия в браузъра
      if ('permissions' in navigator) {
        try {
          const notificationPermission = await navigator.permissions.query({ name: 'notifications' });
          console.log("🔔 Текущо браузър разрешение за известия:", notificationPermission.state);
          
          // Ако има разрешение, но няма active subscription, опитваме се да синхронизираме
          if (notificationPermission.state === 'granted' && !isPushSubscriptionActive) {
            console.log("⚠️ Разрешението е дадено, но абонаментът не е активен - опит за синхронизиране");
            
            // Опит за показване на диалога за пуш известия
            setTimeout(() => {
              window.OneSignal.Slidedown.promptPush({
                force: true,
                forceSlidedownOverNative: true
              });
            }, 1000);
          }
        } catch (permError) {
          console.error("❌ Грешка при проверка на разрешенията:", permError);
        }
      }
      
    } catch (error) {
      console.error("❌ Грешка при проверка на абонамента:", error);
      toast({
        title: "Техническа грешка",
        description: "Не можахме да проверим статуса на абонамента",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Функция за записване на абонамента в базата данни
  const saveSubscriptionToDatabase = async (playerId) => {
    try {
      console.log("💾 Опитваме се да запишем абонамент с ID:", playerId);
      
      if (!window.supabase) {
        console.error("❌ Supabase клиентът не е достъпен");
        return;
      }
      
      const userId = user?.id || null;
      
      // Получаваме допълнителна информация за устройството
      let deviceInfo = {
        browser: navigator.userAgent,
        platform: navigator.platform,
        timestamp: new Date().toISOString()
      };
      
      const { error } = await window.supabase
        .from('push_subscribers')
        .upsert([{
          user_id: userId,
          player_id: playerId,
          device_info: deviceInfo,
          updated_at: new Date().toISOString()
        }], { 
          onConflict: 'player_id',
          ignoreDuplicates: false // Винаги обновяваме записа
        });
      
      if (error) {
        console.error("❌ Грешка при запис на абонамент:", error);
        throw error;
      }
      
      console.log("✅ Push абонатът е записан успешно!");
    } catch (error) {
      console.error("❌ Грешка при запис на абонамент:", error);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      
      // Проверяваме дали OneSignal е зареден
      if (!window.OneSignal) {
        throw new Error("OneSignal не е инициализиран");
      }

      console.log("🔔 Започваме процеса на абониране...");
      
      // Проверка дали браузърът поддържа push известия
      const isPushSupported = await window.OneSignal.isPushNotificationsSupported();
      if (!isPushSupported) {
        toast({
          title: "Непозволен браузър",
          description: "Този браузър не поддържа push известия",
          variant: "destructive"
        });
        return;
      }
      
      // Преди да покажем диалога, проверяваме текущия статус
      const currentStatus = await window.OneSignal.User.PushSubscription.optedIn;
      console.log("🔔 Текущ статус преди абониране:", currentStatus ? "абониран" : "неабониран");
      
      // Принудително отваряме диалога за разрешение и изчакваме потребителя да избере
      const result = await window.OneSignal.Slidedown.promptPush({
        force: true,
        forceSlidedownOverNative: true
      });
      
      console.log("📊 Резултат от диалога:", result);
      
      // Изчакваме малко, за да позволим на браузъра да обработи абонамента
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Проверяваме новия статус след диалога
      const newStatus = await window.OneSignal.User.PushSubscription.optedIn;
      const playerId = await window.OneSignal.User.PushSubscription.id;
      
      console.log("🔔 Нов статус след диалога:", newStatus ? "абониран" : "неабониран");
      console.log("🆔 Нов Player ID:", playerId || "няма");
      
      setIsSubscribed(newStatus);
      
      // Ако абонаментът е успешен, записваме в базата данни
      if (newStatus && playerId) {
        await saveSubscriptionToDatabase(playerId);
        
        toast({
          title: "Успешно абониране",
          description: "Ще получавате известия за нови сигнали",
          variant: "default"
        });
      } else if (!newStatus) {
        // Потребителят е отказал абонамента
        toast({
          title: "Абонаментът е отказан",
          description: "Няма да получавате известия за нови сигнали",
          variant: "default"
        });
      }
      
    } catch (error) {
      console.error("❌ Общa грешка при абониране:", error);
      toast({
        title: "Техническа грешка",
        description: "Не можахме да обработим абонамента",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <Button
        className="bg-spasi-green/80 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2"
        disabled={true}
      >
        <Bell className="h-5 w-5 animate-pulse" />
        <span>Проверка...</span>
      </Button>
    );
  }

  return (
    <Button
      className="bg-spasi-green hover:bg-spasi-green/90 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2 relative group overflow-hidden"
      onClick={handleSubscribe}
      disabled={isSubscribing || isSubscribed}
    >
      <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
      <Bell className="h-5 w-5 relative z-10" />
      <span className="relative z-10">
        {isSubscribing 
          ? "Обработка..." 
          : isSubscribed 
            ? "Абонирани сте" 
            : "Абонирай се"
        }
      </span>
    </Button>
  );
};

export default NotificationButton;
