
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Plus, Info, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navItems = [
    {
      name: 'Начало',
      icon: Home,
      path: '/',
    },
    {
      name: 'Сигнали',
      icon: List,
      path: '/signals',
    },
    {
      name: 'Сигнал', // Changed from 'Подай сигнал' to 'Сигнал'
      icon: Plus,
      path: '/submit-signal',
    },
    {
      name: 'Инфо',
      icon: Info, 
      path: '/blog',
    },
    {
      name: user ? 'Профил' : 'Вход',
      icon: User,
      path: user ? '/admin' : '/auth',
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full px-1",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-area-bottom bg-background" />
    </div>
  );
};

export default MobileNavBar;

