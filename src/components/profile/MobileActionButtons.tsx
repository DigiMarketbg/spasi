
import React from 'react';
import { Flag, MapPin, Eye, Bell, Shield, Settings } from 'lucide-react';
import HubButton from './HubButton';

interface MobileActionButtonsProps {
  isModerator: boolean;
  navigateToPath: (path: string) => void;
  isAdmin?: boolean;
}

export const MobileActionButtons: React.FC<MobileActionButtonsProps> = ({
  isModerator,
  navigateToPath,
  isAdmin = false
}) => {
  return (
    <>
      <HubButton 
        icon={Flag}
        label="Подай сигнал"
        onClick={() => navigateToPath('/submit-signal')}
      />
      
      <HubButton 
        icon={MapPin}
        label="Опасен участък"
        onClick={() => navigateToPath('/add-dangerous-area')}
      />
      
      <HubButton 
        icon={Eye}
        label="Свидетел"
        onClick={() => navigateToPath('/submit-witness')}
      />
      
      <HubButton 
        icon={Bell}
        label="Известия"
        onClick={() => navigateToPath('/notifications')}
      />
    </>
  );
};
