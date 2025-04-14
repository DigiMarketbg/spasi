
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {theme === 'light' ? (
        // Light mode logo - using the new uploaded image
        <img 
          src="/lovable-uploads/fa43aecf-68b6-4f4a-b076-d80dca8d25b4.png" 
          alt="Spasi.bg Logo" 
          className="h-10" 
        />
      ) : (
        // Dark mode logo - using the existing heart icon
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-spasi-red rounded-full flex items-center justify-center relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="absolute"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span className="font-bold text-2xl">Spasi.bg</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
