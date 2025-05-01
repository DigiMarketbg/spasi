
import { useEffect, useState } from 'react';

export const useGDPRConsent = () => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('gdpr-consent');
    if (consent === 'accepted') {
      setHasConsented(true);
    } else {
      // Only show dialog if consent not already given
      setIsOpen(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    setHasConsented(true);
    setIsOpen(false);
  };

  const openConsentDialog = () => {
    setIsOpen(true);
  };

  return { hasConsented, isOpen, setIsOpen, acceptConsent, openConsentDialog };
};
