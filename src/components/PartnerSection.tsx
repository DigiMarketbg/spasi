
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

const PartnerSection = () => {
  return (
    <section className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
      <ParticleBackground count={30} className="opacity-50" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Стани партньор</h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Поддържаме платформата с дарения и партньорска помощ. Всяко дарение помага да продължим
            да поддържаме и развиваме платформата.
          </p>
          
          <Button 
            className="bg-spasi-green hover:bg-spasi-green/90 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            <span>Стани партньор</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
