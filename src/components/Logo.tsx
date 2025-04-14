
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img 
        src={theme === 'light' 
          ? "/lovable-uploads/8db7f922-f5d9-4a9a-a53a-f93967d704dd.png"
          : "/lovable-uploads/67305523-c36e-48e8-b434-fbcbd7931232.png"
        }
        alt="Spasi.bg Logo"
        className="h-12 w-auto"
        width="48"
        height="48"
        loading="eager"
      />
    </div>
  );
};

export default memo(Logo);
