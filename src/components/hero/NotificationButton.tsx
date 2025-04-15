
import React from 'react';
import { Bell, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOneSignal } from '@/hooks/useOneSignal';

const NotificationButton = () => {
  const { isSubscribing, isSubscribed, handleSubscribe, sendTestNotification } = useOneSignal();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
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
      
      {isSubscribed && (
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2"
          onClick={sendTestNotification}
        >
          <SendHorizonal className="h-5 w-5" />
          <span>Тестово известие</span>
        </Button>
      )}
    </div>
  );
};

export default NotificationButton;
