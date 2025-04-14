
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {theme === 'light' ? (
        // Light mode logo
        <img 
          src="/lovable-uploads/8db7f922-f5d9-4a9a-a53a-f93967d704dd.png" 
          alt="Spasi.bg Logo" 
          className="h-12 w-auto" 
        />
      ) : (
        // Dark mode logo
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-spasi-red rounded-full flex items-center justify-center relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
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
