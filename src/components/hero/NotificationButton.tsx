
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

const NotificationButton = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        if (!window.OneSignal) {
          console.error("❌ OneSignal не е зареден");
          return;
        }

        const isPushEnabled = await window.OneSignal.User.PushSubscription.optedIn;
        setIsSubscribed(isPushEnabled);
        console.log(`🔔 Статус на абонамента: ${isPushEnabled ? 'абониран' : 'неабониран'}`);
      } catch (error) {
        console.error("❌ Грешка при проверка на абонамента:", error);
        toast({
          title: "Техническа грешка",
          description: "Не можахме да проверим статуса на абонамента",
          variant: "destructive"
        });
      }
    };

    checkSubscriptionStatus();
  }, []);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      
      if (!window.OneSignal) {
        throw new Error("OneSignal не е инициализиран");
      }

      const isPushEnabled = await window.OneSignal.User.PushSubscription.optedIn;
      
      if (isPushEnabled) {
        setIsSubscribed(true);
        toast({
          title: "Вече сте абонирани",
          description: "Получавате известия от платформата",
        });
        return;
      }

      console.log("🔔 Започваме процеса на абониране...");
      
      const unsubscribe = window.OneSignal.User.PushSubscription.addEventListener('change', async (event) => {
        try {
          const isNowEnabled = await window.OneSignal.User.PushSubscription.optedIn;
          
          if (isNowEnabled) {
            setIsSubscribed(true);
            const playerId = await window.OneSignal.User.PushSubscription.id;
            
            console.log(`🔔 Получен OneSignal player_id: ${playerId}`);
            
            if (window.supabase && playerId) {
              const userId = user?.id || null;
              
              const { error } = await window.supabase
                .from('push_subscribers')
                .upsert([{
                  user_id: userId,
                  player_id: playerId
                }], { onConflict: 'player_id' });
              
              if (error) {
                console.error("❌ Грешка при запис на абонамент:", error);
                throw error;
              }
              
              console.log("✅ Push абонатът е записан успешно!");
            }
            
            toast({
              title: "Успешно абониране",
              description: "Ще получавате известия за нови сигнали",
            });
          }
        } catch (error) {
          console.error("❌ Грешка при обработка на абонамента:", error);
          toast({
            title: "Грешка при абониране",
            description: "Моля, опитайте отново",
            variant: "destructive"
          });
        } finally {
          unsubscribe();
        }
      });
      
      console.log("🔔 Показваме прозореца за абониране");
      await window.OneSignal.Slidedown.promptPush({ force: true });
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
