
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

  if (!isInitialized || !isPushSupported) {
    return null;
  }

  const handleClick = () => {
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
