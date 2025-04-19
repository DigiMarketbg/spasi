

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinksProps {
  className?: string;
}

const NavLinks = ({ className }: NavLinksProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    
    return path !== '/' && location.pathname.includes(path);
  };
  
  const links = [
    { path: '/', label: 'Начало' },
    { path: '/signals', label: 'Сигнали' },
    // Removed good-deeds link
    { path: '/info', label: 'Информация' }
  ];
  
  return (
    <>
      {links.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className={`${className ? className : ''} text-sm font-medium transition-colors hover:text-primary ${
            isActive(link.path) 
              ? 'text-primary font-bold' 
              : 'text-muted-foreground'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;

