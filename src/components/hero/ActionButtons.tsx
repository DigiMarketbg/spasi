
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const ActionButtons = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // Action handlers
  const navigateToSubmitSignal = () => {
    navigate('/submit-signal');
  };
  
  const navigateToSignals = () => {
    navigate('/signals');
  };
  
  return (
    <div className="flex justify-center gap-2 mt-4 animate-fade-in space-x-2" style={{animationDelay: '0.3s'}}>
      <Button 
        onClick={navigateToSubmitSignal}
        className="bg-spasi-red hover:bg-spasi-red/90 px-2.5 py-1.5 h-8 md:h-10 text-xs md:text-sm rounded-full"
        size="sm"
      >
        <PlusCircle className="mr-1 h-3.5 w-3.5 md:h-4 md:w-4" />
        <span>Подай сигнал</span>
      </Button>
      
      <Button 
        onClick={navigateToSignals}
        variant="outline"
        className="px-2.5 py-1.5 h-8 md:h-10 text-xs md:text-sm border-muted-foreground/50 rounded-full"
        size="sm"
      >
        <AlertCircle className="mr-1 h-3.5 w-3.5 md:h-4 md:w-4" />
        <span>Виж сигналите</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
