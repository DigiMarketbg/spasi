
import React from 'react';
import { useGDPR } from './GDPRProvider';
import { Info } from 'lucide-react';

const PrivacyPolicyLink: React.FC = () => {
  const { openConsentDialog } = useGDPR();
  
  return (
    <button 
      onClick={openConsentDialog}
      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <Info className="h-4 w-4 mr-1" />
      Политика за поверителност
    </button>
  );
};

export default PrivacyPolicyLink;
