
import React from 'react';
import { cn } from '@/lib/utils';

const partners = [
  { id: 1, name: 'Партньор 1', logo: 'Партньор 1' },
  { id: 2, name: 'Партньор 2', logo: 'Партньор 2' },
  { id: 3, name: 'Партньор 3', logo: 'Партньор 3' },
  { id: 4, name: 'Партньор 4', logo: 'Партньор 4' },
  { id: 5, name: 'Партньор 5', logo: 'Партньор 5' },
  { id: 6, name: 'Партньор 6', logo: 'Партньор 6' },
  { id: 7, name: 'Партньор 7', logo: 'Партньор 7' },
  { id: 8, name: 'Партньор 8', logo: 'Партньор 8' },
];

const PartnerCarousel = () => {
  return (
    <section className="py-10 px-4 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-xl font-medium text-center text-muted-foreground mb-8">Нашите партньори</h2>
        
        <div className="relative w-full">
          <div className="overflow-hidden">
            <div className="flex gap-8 animate-slide-left">
              {/* Double the partners to create seamless loop */}
              {[...partners, ...partners].map((partner, index) => (
                <div 
                  key={`${partner.id}-${index}`} 
                  className={cn(
                    "flex-shrink-0 h-16 w-32 glass rounded-lg flex items-center justify-center",
                    "hover:border-primary/50 transition-all duration-300"
                  )}
                >
                  <span className="font-medium">{partner.logo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerCarousel;
