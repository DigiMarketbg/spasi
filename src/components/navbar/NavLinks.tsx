
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';

interface NavLinkProps {
  className?: string;
}

const NavLinks = ({ className }: NavLinkProps) => {
  const { isAdmin } = useAuth();
  
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <Link to="/" className="text-foreground hover:text-foreground/80 transition-colors">
        Начало
      </Link>
      <Link to="/signals" className="text-foreground hover:text-foreground/80 transition-colors">
        Сигнали
      </Link>
      <Link to="/blog" className="text-foreground hover:text-foreground/80 transition-colors">
        Блог
      </Link>
      <Link to="/volunteers" className="text-foreground hover:text-foreground/80 transition-colors">
        Доброволци
      </Link>
      {isAdmin && (
        <Link to="/admin" className="text-foreground hover:text-foreground/80 transition-colors">
          Админ
        </Link>
      )}
    </div>
  );
};

export default NavLinks;
