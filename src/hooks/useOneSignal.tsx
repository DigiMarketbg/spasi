
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
      
      console.log("✅ Push абонатът е записан успешно!");
      
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
        
        console.log("🔍 Проверка след абониране:", { isOptedIn, playerId });
        
        if (isOptedIn && playerId) {
          // Записваме в базата данни
          await saveSubscriptionToDatabase(playerId);
          setIsSubscribed(true);
        } else {
          console.log("⚠️ Потребителят не е абониран след диалога или няма playerId");
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
    }
    
    return () => {
      if (window.OneSignal) {
        window.OneSignal.User.PushSubscription.removeEventListener('change', handleSubscriptionChange);
      }
    };
  }, [checkSubscriptionStatus, handleSubscriptionChange]);

  return {
    isSubscribing,
    isSubscribed,
    handleSubscribe
  };
};
