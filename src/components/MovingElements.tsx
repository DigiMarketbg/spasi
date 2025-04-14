import React from 'react';
import { AlertCircle, Shield, Clock, HeartPulse, MapPin, Phone } from 'lucide-react';

const MovingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left emergency icon */}
      <div className="absolute top-20 left-[10%] animate-float opacity-20">
        <AlertCircle className="h-16 w-16 text-spasi-red" />
      </div>
      
      {/* Bottom right shield icon */}
      <div className="absolute bottom-20 right-[15%] animate-float opacity-20" 
           style={{ animationDelay: '1.5s' }}>
        <Shield className="h-14 w-14 text-secondary" />
      </div>
      
      {/* Top right clock icon */}
      <div className="absolute top-[25%] right-[20%] animate-float opacity-20"
           style={{ animationDelay: '1s' }}>
        <Clock className="h-12 w-12 text-primary" />
      </div>
      
      {/* Bottom left heart pulse icon */}
      <div className="absolute bottom-[30%] left-[12%] animate-float opacity-20"
           style={{ animationDelay: '2s' }}>
        <HeartPulse className="h-14 w-14 text-spasi-red" />
      </div>
      
      {/* Middle right map pin */}
      <div className="absolute top-[50%] right-[10%] animate-float opacity-20"
           style={{ animationDelay: '0.5s' }}>
        <MapPin className="h-10 w-10 text-spasi-red" />
      </div>
      
      {/* Middle left phone */}
      <div className="absolute top-[60%] left-[20%] animate-float opacity-20"
           style={{ animationDelay: '2.5s' }}>
        <Phone className="h-12 w-12 text-primary" />
      </div>

      {/* Floating text elements */}
      <div className="absolute top-[10%] left-[5%] animate-float opacity-20"
           style={{ animationDelay: '0.5s' }}>
        <span className="text-xl font-bold text-secondary">Spasi.bg</span>
      </div>
      
      <div className="absolute top-[15%] right-[30%] animate-float opacity-20"
           style={{ animationDelay: '1.2s' }}>
        <span className="text-2xl font-bold text-spasi-red">Спаси Бг</span>
      </div>
      
      <div className="absolute bottom-[25%] right-[25%] animate-float opacity-20"
           style={{ animationDelay: '2.2s' }}>
        <span className="text-2xl font-bold text-primary">Спаси</span>
      </div>
      
      <div className="absolute top-[40%] left-[15%] animate-float opacity-20"
           style={{ animationDelay: '1.8s' }}>
        <span className="text-2xl font-bold text-secondary">Бг</span>
      </div>

      {/* Pulsing circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-10">
        <div className="absolute inset-0 rounded-full border-2 border-spasi-red animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-0 rounded-full border-2 border-spasi-red animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        <div className="absolute inset-0 rounded-full border-2 border-spasi-red animate-ping" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default MovingElements;
