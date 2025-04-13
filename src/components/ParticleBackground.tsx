
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
      
      // Random size between 2-6px
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random starting position
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Random movement distance
      const xEnd = (Math.random() - 0.5) * 100;
      const yEnd = (Math.random() - 0.5) * 100;
      particle.style.setProperty('--x-end', `${xEnd}px`);
      particle.style.setProperty('--y-end', `${yEnd}px`);
      
      // Random delay
      const delay = Math.random() * 5;
      particle.style.animationDelay = `${delay}s`;
      
      // Random opacity
      const opacity = Math.random() * 0.3 + 0.1;
      particle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      
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
