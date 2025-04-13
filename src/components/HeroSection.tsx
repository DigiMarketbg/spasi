
import React from 'react';
import { Search, Bell, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ParticleBackground from './ParticleBackground';
import MovingElements from './MovingElements';

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 md:px-6 lg:px-8 overflow-hidden min-h-[80vh] flex items-center">
      <ParticleBackground count={80} />
      <MovingElements />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in">
            Когато всяка минута е важна.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Spasi.bg е платформата за сигнали при спешни случаи и взаимопомощ.
          </p>
          
          <div className="max-w-xl mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Търсене по дума или град..." 
                className="pr-10 py-6 text-lg rounded-lg"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Button className="bg-spasi-red hover:bg-spasi-red/90 text-white py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2 relative group overflow-hidden">
              <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
              <AlertTriangle className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Подай сигнал</span>
            </Button>
            
            <Button variant="outline" className="border-2 py-6 px-8 rounded-lg text-lg font-medium flex items-center gap-2 relative group overflow-hidden">
              <span className="absolute inset-0 w-0 bg-primary/10 transition-all duration-300 ease-out group-hover:w-full"></span>
              <Bell className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Абонирай се за известия</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
