
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationButton from './NotificationButton';

const ActionButtons = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Функция за подаване на сигнал
  const handleSubmitSignal = () => {
    navigate('/submit-signal');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
      <Button 
        className="bg-spasi-red hover:bg-spasi-red/90 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2 relative group overflow-hidden"
        onClick={handleSubmitSignal}
      >
        <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
        <AlertTriangle className="h-5 w-5 relative z-10" />
        <span className="relative z-10">Подай сигнал</span>
      </Button>
      
      <NotificationButton />
    </div>
  );
};

export default ActionButtons;
