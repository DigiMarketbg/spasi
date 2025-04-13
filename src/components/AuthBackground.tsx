
import React, { useEffect, useRef } from 'react';

const AuthBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Create particles
    const particleCount = 20;
    const particles: HTMLDivElement[] = [];
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random size between 5px and 20px
      const size = Math.random() * 15 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      // Random end position for animation
      const endX = (Math.random() - 0.5) * 200;
      const endY = (Math.random() - 0.5) * 200;
      particle.style.setProperty('--x-end', `${endX}px`);
      particle.style.setProperty('--y-end', `${endY}px`);
      
      // Random opacity and color
      const opacity = Math.random() * 0.15 + 0.05;
      
      // Use the theme colors
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        particle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      } else {
        // For light mode, use the primary color with opacity
        const isRed = Math.random() > 0.7;
        const color = isRed ? 
          `rgba(229, 57, 53, ${opacity})` : // spasi-red
          `rgba(67, 160, 71, ${opacity})`; // spasi-green
        particle.style.backgroundColor = color;
      }
      
      // Random animation duration
      const duration = Math.random() * 8 + 8;
      particle.style.animationDuration = `${duration}s`;
      
      // Random delay
      const delay = Math.random() * 5;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
      particles.push(particle);
    };
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }
    
    // Add circle light effect
    const circle = document.createElement('div');
    circle.classList.add('circle-light');
    container.appendChild(circle);
    
    return () => {
      // Clean up particles
      particles.forEach(particle => {
        if (particle.parentNode === container) {
          container.removeChild(particle);
        }
      });
      
      // Remove circle light
      if (circle.parentNode === container) {
        container.removeChild(circle);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-background to-background/70"></div>
      
      {/* Top-right decorative element */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-spasi-red/5 blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
      
      {/* Bottom-left decorative element */}
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-spasi-green/5 blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      
      <style jsx>{`
        .circle-light {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(var(--color-primary), 0.15) 0%,
            rgba(var(--color-primary), 0) 70%
          );
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse-light 10s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default AuthBackground;
