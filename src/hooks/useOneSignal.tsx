
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

/**
 * Custom hook to handle OneSignal subscription logic
 */
export const useOneSignal = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();

  // Saves the subscription to the database
  const saveSubscriptionToDatabase = useCallback(async (playerId: string) => {
    try {
      console.log("💾 Опитваме се да запишем абонамент с ID:", playerId);
      
      if (!window.supabase) {
        console.error("❌ Supabase клиентът не е достъпен");
        return;
      }
      
      const userId = user?.id || null;
      
      const { error } = await window.supabase
        .from('push_subscribers')
        .upsert([{
          user_id: userId,
          player_id: playerId,
          updated_at: new Date().toISOString()
        }], { onConflict: 'player_id' });
      
      if (error) {
        console.error("❌ Грешка при запис на абонамент:", error);
        throw error;
      }
      
      console.log("✅ Push абонатът е записан успешно в базата данни!");
      
      // След успешен запис в базата данни, показваме известие за потвърждение
      toast({
        title: "Успешен абонамент",
        description: "Вече ще получавате известия за нови сигнали",
        variant: "default"
      });
    } catch (error) {
      console.error("❌ Грешка при запис на абонамент:", error);
    }
  }, [user]);

  // Handles subscription changes from OneSignal
  const handleSubscriptionChange = useCallback(async (event: any) => {
    try {
      console.log("🔄 Промяна в push абонамента", event);
      
      // Проверяваме дали OneSignal е наличен
      if (!window.OneSignal) {
        console.error("❌ OneSignal не е достъпен при промяна на абонамента");
        return;
      }
      
      const isSubscribed = await window.OneSignal.User.PushSubscription.optedIn;
      const playerId = await window.OneSignal.User.PushSubscription.id;
      
      console.log(`🔔 Нов статус: ${isSubscribed ? 'абониран' : 'неабониран'}, ID: ${playerId || 'няма'}`);
      console.log(`📊 Детайли на абонамента:`, window.OneSignal.User.PushSubscription);
      
      // Проверяваме дали данните за абонамента са валидни
      if (isSubscribed && !playerId) {
        console.error("⚠️ Странно състояние: Абониран, но няма playerId");
      }
      
      setIsSubscribed(isSubscribed);
      
      if (isSubscribed && playerId) {
        await saveSubscriptionToDatabase(playerId);
        
        // Проверка дали абонаментът е видим в OneSignal
        console.log("🔍 Проверка на абонамента в OneSignal SDK:", {
          optedIn: isSubscribed,
          playerId: playerId,
          isPushSupported: window.OneSignal.isPushNotificationsSupported && await window.OneSignal.isPushNotificationsSupported()
        });
      }
    } catch (error) {
      console.error("❌ Грешка при обработка на промяна в абонамента:", error);
    }
  }, [saveSubscriptionToDatabase]);

  // Checks the current subscription status
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      if (!window.OneSignal) {
        console.error("❌ OneSignal не е зареден");
        return;
      }

      // Проверка дали SDK е инициализиран
      if (!window.OneSignal.initialized) {
        console.log("⏳ Изчакваме OneSignal да се инициализира...");
        // Използваме deferred функция, за да изчакаме инициализацията
        window.OneSignalDeferred.push(async function() {
          checkSubscriptionStatus();
        });
        return;
      }

      // Проверяваме дали браузърът поддържа push известия
      const isPushSupported = await window.OneSignal.isPushNotificationsSupported();
      console.log(`🔔 Push известията се поддържат: ${isPushSupported ? 'да' : 'не'}`);
      
      if (!isPushSupported) {
        toast({
          title: "Известията не се поддържат",
          description: "Този браузър не поддържа push известия",
          variant: "destructive"
        });
        return;
      }

      // Проверяваме дали потребителят е абониран
      const isPushSubscriptionActive = await window.OneSignal.User.PushSubscription.optedIn;
      const playerId = await window.OneSignal.User.PushSubscription.id;
      
      setIsSubscribed(isPushSubscriptionActive);
      
      console.log(`🔔 Текущ статус на абонамента: ${isPushSubscriptionActive ? 'абониран' : 'неабониран'}`);
      console.log(`🆔 Player ID: ${playerId || 'няма'}`);
      
      // Подробни логове за диагностика
      console.log("📊 Детайлна информация за абонамента:", {
        optedIn: isPushSubscriptionActive,
        playerId: playerId,
        pushSubscription: window.OneSignal.User.PushSubscription,
        browserType: navigator.userAgent,
        serviceWorkerStatus: 'serviceWorker' in navigator ? 'поддържа се' : 'не се поддържа'
      });
      
      // Ако е абониран, но нямаме записан ID, записваме го в Supabase
      if (isPushSubscriptionActive && playerId) {
        saveSubscriptionToDatabase(playerId);
      }
    } catch (error) {
      console.error("❌ Грешка при проверка на абонамента:", error);
      toast({
        title: "Техническа грешка",
        description: "Не можахме да проверим статуса на абонамента",
        variant: "destructive"
      });
    }
  }, [saveSubscriptionToDatabase]);

  // Handles the subscription process
  const handleSubscribe = useCallback(async () => {
    try {
      setIsSubscribing(true);
      
      // Проверяваме дали OneSignal е зареден
      if (!window.OneSignal) {
        throw new Error("OneSignal не е инициализиран");
      }

      console.log("🔔 Започваме процеса на абониране...");
      
      // Проверяваме дали браузърът поддържа push известия
      const isPushSupported = await window.OneSignal.isPushNotificationsSupported();
      if (!isPushSupported) {
        throw new Error("Този браузър не поддържа push известия");
      }
      
      // Детайлни логове преди абониране
      console.log("📊 Състояние преди абониране:", {
        isInitialized: window.OneSignal.initialized,
        serviceWorkerState: 'serviceWorker' in navigator ? 'active' : 'не е активен',
        userAgent: navigator.userAgent
      });
      
      // Принудително отваряме диалога за разрешение и изчакваме потребителя да избере
      const result = await window.OneSignal.Slidedown.promptPush({
        force: true,
        forceSlidedownOverNative: true
      });
      
      console.log("📊 Резултат от диалога:", result);
      
      // Изчакваме малко, за да може промяната в абонамента да се отрази
      setTimeout(async () => {
        // Проверяваме отново статуса и изпращаме ръчно към OneSignal сървъра
        const isOptedIn = await window.OneSignal.User.PushSubscription.optedIn;
        const playerId = await window.OneSignal.User.PushSubscription.id;
        
        console.log("🔍 Проверка след абониране:", { 
          isOptedIn, 
          playerId,
          pushSubscription: window.OneSignal.User.PushSubscription 
        });
        
        if (isOptedIn && playerId) {
          // Записваме в базата данни
          await saveSubscriptionToDatabase(playerId);
          setIsSubscribed(true);
          
          // Допълнителни данни за диагностика
          console.log("✅ Абонаментът е успешен! Допълнителна диагностична информация:", {
            initialized: window.OneSignal.initialized,
            optedIn: isOptedIn,
            playerId: playerId
          });
          
          // Тестово съобщение за потвърждение на абонамента
          console.log("📣 Изпращаме тестово съобщение за потвърждение...");
          try {
            if (window.OneSignal.Notifications) {
              await window.OneSignal.Notifications.sendSelfNotification(
                "Тестово известие", // Заглавие
                "Ако виждате това, значи системата за известия работи!", // Текст
                window.location.origin + "?test=true", // URL
                "/icon-192.png", // Икона 
                { test: true } // Данни
              );
              console.log("✅ Тестовото съобщение е изпратено успешно!");
            } else {
              console.warn("⚠️ Функцията за тестови известия не е налична в тази версия на OneSignal");
              // Използваме Service Worker API директно за тестови съобщения
              if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification("Тестово известие", {
                  body: "Ако виждате това, значи системата за известия работи!",
                  icon: "/icon-192.png",
                  data: { url: window.location.origin + "?test=true", test: true }
                });
                console.log("✅ Тестовото съобщение е изпратено чрез Service Worker API!");
              }
            }
          } catch (e) {
            console.error("❌ Грешка при изпращане на тестово съобщение:", e);
          }
        } else {
          console.log("⚠️ Потребителят не е абониран след диалога или няма playerId");
          
          // Опит за диагностика на проблема
          if (isOptedIn && !playerId) {
            console.error("🔴 Критична грешка: потребителят е абониран, но няма PlayerId");
            // Опит за ръчно вземане на playerId
            try {
              const deviceState = window.OneSignal.User && window.OneSignal.User.PushSubscription;
              console.log("🔍 Опит за ръчно вземане на данни:", deviceState);
            } catch (e) {
              console.error("❌ Грешка при опита за ръчно вземане на данни:", e);
            }
          }
        }
        
        setIsSubscribing(false);
      }, 2000);
      
    } catch (error) {
      console.error("❌ Общa грешка при абониране:", error);
      toast({
        title: "Техническа грешка",
        description: error.message || "Не можахме да обработим абонамента",
        variant: "destructive"
      });
      setIsSubscribing(false);
    }
  }, [saveSubscriptionToDatabase]);

  // Set up listeners for subscription changes
  useEffect(() => {
    checkSubscriptionStatus();
    
    // Add a global listener for subscription changes
    if (window.OneSignal) {
      console.log("🟢 Настройваме OneSignal слушател при зареждане");
      window.OneSignal.User.PushSubscription.addEventListener('change', handleSubscriptionChange);
    } else {
      console.error("❌ OneSignal не е наличен при зареждане на компонента");
      
      // Проверка на скриптовете за OneSignal
      const oneSignalScripts = document.querySelectorAll('script[src*="onesignal"]');
      console.log(`📜 Намерени OneSignal скриптове: ${oneSignalScripts.length}`);
      
      // Проверка на Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          console.log(`👷 Регистрирани Service Workers: ${registrations.length}`);
          registrations.forEach(reg => {
            console.log('👷 SW Scope:', reg.scope);
          });
        });
      }
    }
    
    return () => {
      if (window.OneSignal) {
        window.OneSignal.User.PushSubscription.removeEventListener('change', handleSubscriptionChange);
      }
    };
  }, [checkSubscriptionStatus, handleSubscriptionChange]);

  // Method to test sending a notification manually
  const sendTestNotification = useCallback(async () => {
    try {
      if (!window.OneSignal) {
        throw new Error("OneSignal не е инициализиран");
      }
      
      if (!isSubscribed) {
        throw new Error("Потребителят не е абониран за известия");
      }
      
      console.log("📣 Опитваме се да изпратим тестово съобщение...");
      
      // Check if the Notifications API is available
      if (window.OneSignal.Notifications) {
        await window.OneSignal.Notifications.sendSelfNotification(
          "Тестово известие от Спаси.БГ", 
          "Ако виждате това, значи системата за известия работи правилно!",
          window.location.origin,
          "/icon-192.png", 
          { test: true }
        );
        
        console.log("✅ Тестовото съобщение е изпратено успешно!");
        
        toast({
          title: "Изпратено тестово известие",
          description: "Проверете дали сте получили известието",
          variant: "default"
        });
      } else {
        console.warn("⚠️ OneSignal Notifications API не е наличен");
        
        // Fallback to using Service Worker API directly
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification("Тестово известие от Спаси.БГ", {
            body: "Ако виждате това, значи системата за известия работи правилно!",
            icon: "/icon-192.png",
            data: { url: window.location.origin, test: true }
          });
          
          console.log("✅ Тестовото съобщение е изпратено чрез Service Worker API!");
          
          toast({
            title: "Изпратено тестово известие",
            description: "Проверете дали сте получили известието",
            variant: "default"
          });
        } else {
          throw new Error("Нито OneSignal, нито Service Worker API са налични за изпращане на известия");
        }
      }
    } catch (error) {
      console.error("❌ Грешка при изпращане на тестово съобщение:", error);
      toast({
        title: "Грешка",
        description: error.message || "Не успяхме да изпратим тестово съобщение",
        variant: "destructive"
      });
    }
  }, [isSubscribed]);

  return {
    isSubscribing,
    isSubscribed,
    handleSubscribe,
    sendTestNotification
  };
};

