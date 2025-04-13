
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-8 h-8 bg-spasi-red rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      <span className="font-bold text-2xl">Spasi.bg</span>
    </div>
  );
};

export default Logo;
