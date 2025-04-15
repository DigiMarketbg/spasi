
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactCollapsible from '@/components/info/ContactCollapsible';
import PlatformDescription from '@/components/info/PlatformDescription';
import TermsAccordion from '@/components/info/TermsAccordion';
import { useGDPR } from '@/components/gdpr/GDPRProvider';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Info = () => {
  const { openConsentDialog } = useGDPR();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Информация</h1>
          
          <ContactCollapsible />
          <PlatformDescription />
          
          <div className="glass p-6 md:p-8 rounded-xl mb-8">
            <TermsAccordion />
          </div>
          
          <div className="glass p-6 md:p-8 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Политика за поверителност</h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              В Spasi.bg се ангажираме с поверителността на вашите данни, съгласно изискванията на GDPR.
              За повече информация относно как обработваме вашите данни, можете да прегледате нашата 
              подробна политика за поверителност.
            </p>
            
            <Button 
              onClick={openConsentDialog}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Shield className="mr-2 h-4 w-4" />
              Преглед на политика за поверителност
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Info;
