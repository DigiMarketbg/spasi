
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
    <div className="flex justify-center gap-3 mt-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
      <Button 
        onClick={navigateToSubmitSignal}
        className="bg-spasi-red hover:bg-spasi-red/90"
        size="lg"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Подай сигнал
      </Button>
      
      <Button 
        onClick={navigateToSignals}
        variant="outline"
        size="lg"
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        Виж сигналите
      </Button>
    </div>
  );
};

export default ActionButtons;
