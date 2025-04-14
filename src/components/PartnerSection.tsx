
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { useNavigate } from 'react-router-dom';
import Image from '@/components/ui/image'; // Assuming you have an Image component

const PartnerSection = () => {
  const navigate = useNavigate();

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
          
          {/* Partner Logo Section */}
          <div className="flex justify-center mb-8">
            <div className="bg-black/50 p-4 rounded-lg inline-block">
              <img 
                src="/lovable-uploads/f1e019f9-3126-4389-b433-2928fac89dcf.png" 
                alt="Отстъпки Partner Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white py-6 px-8 rounded-lg text-base font-medium flex items-center gap-2"
              onClick={() => navigate('/donations')}
            >
              <Heart className="h-5 w-5" />
              <span>Направи дарение</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;

