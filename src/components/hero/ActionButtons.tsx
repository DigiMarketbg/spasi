
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
        className="bg-spasi-red hover:bg-spasi-red/90 px-3 py-2 h-10 md:h-11"
        size="sm"
      >
        <PlusCircle className="mr-1 h-4 w-4" />
        <span className="text-xs md:text-sm">Подай сигнал</span>
      </Button>
      
      <Button 
        onClick={navigateToSignals}
        variant="outline"
        className="px-3 py-2 h-10 md:h-11 border-muted-foreground/50"
        size="sm"
      >
        <AlertCircle className="mr-1 h-4 w-4" />
        <span className="text-xs md:text-sm">Виж сигналите</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
