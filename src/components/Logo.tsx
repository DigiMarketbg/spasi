
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img 
        src="/lovable-uploads/2b23da05-1088-41a2-800e-5cda238a09d9.png" 
        alt="Spasi.bg Logo" 
        className="w-8 h-8 object-contain"
      />
      <span className="font-bold text-2xl">Spasi.bg</span>
    </div>
  );
};

export default Logo;
