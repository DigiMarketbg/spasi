
import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useOneSignal } from './OneSignalProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SubscribeButtonProps extends Omit<ButtonProps, 'onClick'> {
  showText?: boolean;
  id?: string;
}

const SubscribeButton = ({ 
  showText = true, 
  variant = "outline",
  className,
  id = "subscribeBtn",
  ...props 
}: SubscribeButtonProps) => {
  const { isSubscribed, isPushSupported, isInitialized, subscribe, unsubscribe } = useOneSignal();

  // Добавяме повече log съобщения за по-добро дебъгване
  console.log('SubscribeButton State:', { 
    isSubscribed, 
    isPushSupported, 
    isInitialized 
  });

  // Показваме бутона, дори ако не е абониран
  if (!isInitialized) {
    console.log('OneSignal не е инициализиран');
    return null;
  }

  if (!isPushSupported) {
    console.log('Push известията не се поддържат');
    return null;
  }

  const handleClick = () => {
    console.log('SubscribeButton clicked', { 
      currentSubscriptionStatus: isSubscribed 
    });
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant}
            onClick={handleClick}
            className={className}
            id={id}
            {...props}
          >
            {isSubscribed ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                {showText && <span>Отписване от известия</span>}
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                {showText && <span>Абониране за известия</span>}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isSubscribed 
            ? 'Спиране на известията' 
            : 'Получавайте известия за нови сигнали'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SubscribeButton;
