
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOneSignal } from '@/hooks/useOneSignal';

const NotificationButton = () => {
  const { isSubscribing, isSubscribed, handleSubscribe } = useOneSignal();

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
