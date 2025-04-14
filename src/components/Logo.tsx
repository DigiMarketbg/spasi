
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img 
        src="/lovable-uploads/6ae889da-fa60-4bae-9811-a9f6c34c7166.png" 
        alt="Spasi.bg Logo" 
        className="w-8 h-8 rounded-full" 
      />
      <span className="font-bold text-2xl">Spasi.bg</span>
    </div>
  );
};

export default Logo;
