
import React from 'react';
import { Flag, MapPin, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileActionButtonsProps {
  isModerator: boolean;
  navigateToPath: (path: string) => void;
}

export const MobileActionButtons: React.FC<MobileActionButtonsProps> = ({
  isModerator,
  navigateToPath
}) => {
  return (
    <>
      <Button 
        variant="outline"
        onClick={() => navigateToPath('/submit-signal')}
        className="flex flex-col items-center justify-center h-24 text-center"
      >
        <Flag className="h-6 w-6 mb-2" />
        <span>Подай сигнал</span>
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => navigateToPath('/add-dangerous-area')}
        className="flex flex-col items-center justify-center h-24 text-center"
      >
        <MapPin className="h-6 w-6 mb-2" />
        <span>Опасен участък</span>
      </Button>
      
      <Button 
        variant="outline"
        onClick={() => navigateToPath('/submit-witness')}
        className="flex flex-col items-center justify-center h-24 text-center"
      >
        <Eye className="h-6 w-6 mb-2" />
        <span>Свидетел</span>
      </Button>
      
      {isModerator && (
        <Button 
          variant="outline"
          onClick={() => navigateToPath('/moderator')}
          className="flex flex-col items-center justify-center h-24 text-center"
        >
          <Check className="h-6 w-6 mb-2" />
          <span>Одобрения</span>
        </Button>
      )}
    </>
  );
};
