
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactCollapsible from '@/components/info/ContactCollapsible';
import PlatformDescription from '@/components/info/PlatformDescription';
import TermsAccordion from '@/components/info/TermsAccordion';
import { useGDPR } from '@/components/gdpr/GDPRProvider';
import { Button } from '@/components/ui/button';
import { Shield, SquareCode, Share2, AlertTriangle, HeartHandshake } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Info = () => {
  const { openConsentDialog } = useGDPR();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Информация за Spasi.bg</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Платформа за взаимопомощ и сигнали при спешни ситуации
            </p>
            <div className="flex justify-center mt-6 gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => window.open('/submit-signal', '_blank')}
              >
                <AlertTriangle className="h-4 w-4 text-spasi-red" />
                <span>Подай сигнал</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => window.open('/volunteers', '_blank')}
              >
                <HeartHandshake className="h-4 w-4 text-spasi-green" />
                <span>Стани доброволец</span>
              </Button>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* New Contact Section Moved Higher */}
          <ContactCollapsible />
          
          <Separator className="my-8" />
          
          <PlatformDescription />
          
          <div className="glass p-6 md:p-8 rounded-xl mb-8">
            <div className="flex items-center gap-2 mb-6">
              <SquareCode className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Условия за ползване</h2>
            </div>
            
            <TermsAccordion />
            
            <div className="flex justify-end mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => window.open('https://spasi.bg/terms', '_blank')}
              >
                <Share2 className="mr-1 h-3 w-3" />
                Пълни условия
              </Button>
            </div>
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
              size="sm"
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
