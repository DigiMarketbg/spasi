
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  const { theme } = useTheme();
  
  // Предварително дефинирани пътища за изображенията, за да се избегне повторно изчисление
  const lightLogoPath = "/lovable-uploads/8db7f922-f5d9-4a9a-a53a-f93967d704dd.png";
  const darkLogoPath = "/lovable-uploads/67305523-c36e-48e8-b434-fbcbd7931232.png";
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img 
        src={theme === 'light' ? lightLogoPath : darkLogoPath}
        alt="Spasi.bg Logo"
        className="h-12 w-auto"
        width="48"
        height="48"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
    </div>
  );
};

// Използваме memo за предотвратяване на ненужни рендери
export default memo(Logo);
