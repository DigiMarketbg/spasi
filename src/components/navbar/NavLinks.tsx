
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavLinks = () => {
  const links = [
    { to: '/', label: 'Начало' },
    { to: '/signals', label: 'Сигнали' },
    { to: '/blog', label: 'Блог' },
    { to: '/donations', label: 'Дарения' },
  ];

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `text-foreground font-medium hover:text-primary transition-colors ${
              isActive ? 'text-primary font-semibold' : ''
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;
