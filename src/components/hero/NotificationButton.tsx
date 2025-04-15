
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

const NotificationButton = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();

  // Проверява състоянието на абонамента при зареждане на компонента
  useEffect(() => {
    checkSubscriptionStatus();
    
    // Добавяме глобален слушател за промени в абонамента
    if (window.OneSignal) {
      console.log("🟢 Настройваме OneSignal слушател при зареждане");
      window.OneSignal.User.PushSubscription.addEventListener('change', handleSubscriptionChange);
    }
    
    return () => {
      if (window.OneSignal) {
        window.OneSignal.User.PushSubscription.removeEventListener('change', handleSubscriptionChange);
      }
    };
  }, []);

  const checkSubscriptionStatus = async () => {
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
  };

  // Функция за обработка на промени в абонамента от OneSignal
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

  // Функция за записване на абонамента в базата данни
  const saveSubscriptionToDatabase = async (playerId) => {
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
      
      // Принудително отваряме диалога за разрешение и изчакваме потребителя да избере
      const result = await window.OneSignal.Slidedown.promptPush({
        force: true,
        forceSlidedownOverNative: true
      });
      
      console.log("📊 Резултат от диалога:", result);
      
      // След като диалогът е показан, проверяваме отново статуса
      // (промяната в абонамента ще бъде уловена от обработчика на събитие)
      setTimeout(checkSubscriptionStatus, 2000);
      
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
