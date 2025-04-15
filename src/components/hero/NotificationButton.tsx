
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

const NotificationButton = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();

  // Проверяваме дали потребителят вече е абониран при зареждане
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        if (window.OneSignal) {
          const isPushEnabled = await window.OneSignal.User.PushSubscription.optedIn;
          setIsSubscribed(isPushEnabled);
          console.log(`🔔 Текущ статус на абонамента: ${isPushEnabled ? 'абониран' : 'неабониран'}`);
        }
      } catch (error) {
        console.error("Грешка при проверка на абонамента:", error);
      }
    };

    checkSubscriptionStatus();
  }, []);

  // Функция за абониране за известия
  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      
      if (window.OneSignal) {
        // Проверяваме дали потребителят вече е абониран
        const isPushEnabled = await window.OneSignal.User.PushSubscription.optedIn;
        
        if (isPushEnabled) {
          setIsSubscribed(true);
          toast({
            title: "Вече сте абонирани",
            description: "Вече получавате известия от платформата",
          });
        } else {
          console.log("🔔 Започваме процеса на абониране...");
          
          // Добавяме слушател преди да покажем прозореца за абониране
          const unsubscribe = window.OneSignal.User.PushSubscription.addEventListener('change', async (event) => {
            const isNowEnabled = await window.OneSignal.User.PushSubscription.optedIn;
            console.log(`🔔 Статус на абонамента променен: ${isNowEnabled ? 'абониран' : 'неабониран'}`);
            
            if (isNowEnabled) {
              setIsSubscribed(true);
              
              try {
                // Получаваме player_id след успешен абонамент
                const playerId = await window.OneSignal.User.PushSubscription.id;
                console.log(`🔔 Получен OneSignal player_id: ${playerId}`);
                
                if (playerId) {
                  // Записваме абонамента в базата данни
                  console.log("🔔 Опит за запис на абонамент в базата данни");
                  
                  if (window.supabase) {
                    const userId = user?.id || null;
                    console.log(`🔔 Записване на push абонат с user_id: ${userId}, player_id: ${playerId}`);
                    
                    const { error } = await window.supabase
                      .from('push_subscribers')
                      .upsert([{
                        user_id: userId,
                        player_id: playerId
                      }], { onConflict: 'player_id' });
                    
                    if (error) {
                      console.error("❌ Грешка при запис на push абонат:", error);
                    } else {
                      console.log("✅ Push абонатът е записан успешно в базата данни!");
                    }
                  } else {
                    console.error("❌ Supabase клиентът не е достъпен");
                  }
                }
                
                toast({
                  title: "Успешно абониране",
                  description: "Вече ще получавате известия за нови сигнали",
                });
              } catch (error) {
                console.error("❌ Грешка при обработка на абонамента:", error);
              }
              
              // Премахваме слушателя след успешно абониране
              unsubscribe();
            }
          });
          
          // Използваме стандартния OneSignal прозорец за абониране
          console.log("🔔 Показваме прозореца за абониране");
          window.OneSignal.Slidedown.promptPush({
            force: true // Това ще покаже прозореца дори ако потребителят вече го е отхвърлил
          });
        }
      } else {
        console.error("❌ OneSignal не е наличен");
        toast({
          title: "Грешка",
          description: "OneSignal не е наличен. Моля, опитайте отново по-късно.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Грешка при абониране за известия:", error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при абониране за известия",
        variant: "destructive",
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
