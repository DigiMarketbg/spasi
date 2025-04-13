
import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  count?: number;
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  count = 50,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Clean up any existing particles
    const existingParticles = container.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());

    // Create new particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random size between 2-8px
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random starting position
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Random movement distance
      const xEnd = (Math.random() - 0.5) * 150;
      const yEnd = (Math.random() - 0.5) * 150;
      particle.style.setProperty('--x-end', `${xEnd}px`);
      particle.style.setProperty('--y-end', `${yEnd}px`);
      
      // Random delay
      const delay = Math.random() * 5;
      particle.style.animationDelay = `${delay}s`;
      
      // Random opacity
      const opacity = Math.random() * 0.4 + 0.1;
      
      // Choose color - mix of reds and primary colors with low opacity
      const isRed = Math.random() > 0.7;
      if (isRed) {
        particle.style.backgroundColor = `rgba(229, 57, 53, ${opacity})`; // spasi-red with opacity
      } else {
        particle.style.backgroundColor = `rgba(100, 100, 100, ${opacity})`; // gray with opacity
      }
      
      container.appendChild(particle);
      particle.classList.add('animate-particle-move');
    }

    return () => {
      // Clean up particles on unmount
      const particles = container.querySelectorAll('.particle');
      particles.forEach(particle => particle.remove());
    };
  }, [count]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Particles will be added here dynamically */}
    </div>
  );
};

export default ParticleBackground;
