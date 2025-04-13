
import React from 'react';

const navLinks = [
  { name: 'Начало', href: '/' },
  { name: 'Сигнали', href: '#' },
  { name: 'Доброволци', href: '#' },
  { name: 'Партньори', href: '#' },
  { name: 'За нас', href: '#' }
];

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

const NavLinks = ({ className, onClick }: NavLinksProps) => {
  return (
    <>
      {navLinks.map((link) => (
        <a 
          key={link.name}
          href={link.href}
          className={className || "text-foreground hover:text-primary transition-colors"}
          onClick={onClick}
        >
          {link.name}
        </a>
      ))}
    </>
  );
};

export default NavLinks;
