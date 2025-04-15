
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';
import MovingElements from './MovingElements';
import SearchBar from './hero/SearchBar';
import ActionButtons from './hero/ActionButtons';
import FeatureButtons from './hero/FeatureButtons';

const HeroSection = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
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
          
          <SearchBar initialQuery={initialQuery} />
          <ActionButtons />
          <FeatureButtons />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
