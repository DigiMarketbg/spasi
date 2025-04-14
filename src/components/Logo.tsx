
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
        // Light mode logo (existing logo)
        <img 
          src="/lovable-uploads/8db7f922-f5d9-4a9a-a53a-f93967d704dd.png" 
          alt="Spasi.bg Logo" 
          className="h-12 w-auto" 
        />
      ) : (
        // Dark mode logo (new logo)
        <img 
          src="/lovable-uploads/67305523-c36e-48e8-b434-fbcbd7931232.png" 
          alt="Spasi.bg Logo Dark Mode" 
          className="h-12 w-auto" 
        />
      )}
    </div>
  );
};

export default Logo;
