
import React, { createContext, useContext, ReactNode } from 'react';
import GDPRConsentDialog, { useGDPRConsent } from './GDPRConsentDialog';

interface GDPRContextType {
  hasConsented: boolean;
  openConsentDialog: () => void;
}

const GDPRContext = createContext<GDPRContextType | undefined>(undefined);

export const useGDPR = () => {
  const context = useContext(GDPRContext);
  if (context === undefined) {
    throw new Error('useGDPR must be used within a GDPRProvider');
  }
  return context;
};

interface GDPRProviderProps {
  children: ReactNode;
}

export const GDPRProvider: React.FC<GDPRProviderProps> = ({ children }) => {
  const { hasConsented, isOpen, setIsOpen, acceptConsent, openConsentDialog } = useGDPRConsent();
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <GDPRContext.Provider value={{ hasConsented, openConsentDialog }}>
      {children}
      <GDPRConsentDialog 
        isOpen={isOpen} 
        onClose={handleClose} 
        onAccept={acceptConsent}
      />
    </GDPRContext.Provider>
  );
};
