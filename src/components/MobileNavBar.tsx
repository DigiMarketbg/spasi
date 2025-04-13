
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, List, Plus, Info, User, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/ui/tubelight-navbar';

const MobileNavBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  if (!isMobile) return null;

  const navItems = [
    {
      name: 'Начало',
      icon: Home,
      url: '/',
    },
    {
      name: 'Сигнали',
      icon: List,
      url: '/signals',
    },
    {
      name: 'Сигнал',
      icon: Plus,
      url: '/submit-signal',
    },
    {
      name: 'Инфо',
      icon: Info, 
      url: '/blog',
    },
    {
      name: user ? 'Профил' : 'Вход',
      icon: User,
      url: user ? '/admin' : '/auth',
    }
  ];

  return (
    <>
      {/* Top mobile navbar with logo and theme toggle */}
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50 md:hidden">
        <div className="flex justify-between items-center h-16 px-4">
          <div className="w-10"></div> {/* Empty div for balance */}
          <Logo className="scale-75" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-full" 
            onClick={toggleTheme}
          >
            <Palette className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Bottom navigation - now using our tubelight navbar */}
      <NavBar items={navItems} className="md:hidden" />
    </>
  );
};

export default MobileNavBar;
