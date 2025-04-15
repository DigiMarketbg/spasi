
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const NotificationButton = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Функция за абониране за известия
  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      
      if (window.OneSignal) {
        // Проверяваме дали потребителят вече е абониран
        const isPushEnabled = await window.OneSignal.User.PushSubscription.optedIn;
        
        if (isPushEnabled) {
          toast({
            title: "Вече сте абонирани",
            description: "Вече получавате известия от платформата",
          });
        } else {
          // Използваме стандартния OneSignal прозорец за абониране
          window.OneSignal.Slidedown.promptPush({
            force: true // Това ще покаже прозореца дори ако потребителят вече го е отхвърлил
          });
          
          // Добавяме слушател за промяна на статуса на абонамента
          const unsubscribe = window.OneSignal.User.PushSubscription.addEventListener('change', async (event) => {
            const isNowEnabled = await window.OneSignal.User.PushSubscription.optedIn;
            
            if (isNowEnabled) {
              toast({
                title: "Успешно абониране",
                description: "Вече ще получавате известия за нови сигнали",
              });
              
              // Премахваме слушателя след успешно абониране
              unsubscribe();
            }
          });
        }
      } else {
        console.error("OneSignal not available");
        toast({
          title: "Грешка",
          description: "OneSignal не е наличен. Моля, опитайте отново по-късно.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
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
      disabled={isSubscribing}
    >
      <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
      <Bell className="h-5 w-5 relative z-10" />
      <span className="relative z-10">{isSubscribing ? "Обработка..." : "Абонирай се"}</span>
    </Button>
  );
};

export default NotificationButton;
