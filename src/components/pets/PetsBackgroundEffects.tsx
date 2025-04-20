
import React from 'react';
import { Dog, Cat, PawPrint } from 'lucide-react';

const PetsBackgroundEffects = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Floating animal icons */}
      <div 
        className="absolute top-16 left-[10%] animate-float opacity-20"
        style={{ animationDuration: '6s', animationDelay: '0s' }}
        aria-hidden="true"
      >
        <Dog className="h-16 w-16 text-sky-400" />
      </div>
      <div 
        className="absolute top-24 right-[15%] animate-float opacity-20"
        style={{ animationDuration: '8s', animationDelay: '1.5s' }}
        aria-hidden="true"
      >
        <Cat className="h-14 w-14 text-purple-300" />
      </div>
      <div 
        className="absolute bottom-24 left-[12%] animate-float opacity-20"
        style={{ animationDuration: '7s', animationDelay: '2s' }}
        aria-hidden="true"
      >
        <PawPrint className="h-12 w-12 text-purple-400" />
      </div>

      {/* Floating text elements */}
      <div 
        className="absolute top-[10%] left-[5%] animate-float opacity-20 text-white font-bold select-none"
        style={{ animationDuration: '6s', animationDelay: '0.5s', fontSize: '1.25rem' }}
        aria-hidden="true"
      >
        Spasi.bg
      </div>
      <div 
        className="absolute top-[15%] right-[30%] animate-float opacity-20 text-blue-400 font-bold select-none"
        style={{ animationDuration: '6s', animationDelay: '1.2s', fontSize: '1.5rem' }}
        aria-hidden="true"
      >
        Спаси Бг
      </div>

      {/* Background pulsing circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-10 pointer-events-none select-none">
        <div className="absolute inset-0 rounded-full border-2 border-sky-400 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-0 rounded-full border-2 border-sky-400 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        <div className="absolute inset-0 rounded-full border-2 border-sky-400 animate-ping" style={{ animationDuration: '3s', animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default PetsBackgroundEffects;

