
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, List, Info, User, Plus, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';
import UserMenu from './navbar/UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavBar } from '@/components/ui/tubelight-navbar';

const Navbar = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.full_name || user?.email || 'Потребител';

  // Hide the navbar completely on mobile screens
  if (isMobile) return null;

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
      name: 'Блог',
      icon: Info,
      url: '/blog',
    },
    {
      name: 'Доброволци',
      icon: User,
      url: '/volunteers',
    },
    {
      name: 'Сигнал',
      icon: Plus,
      url: '/submit-signal',
    }
  ];

  if (isAdmin) {
    navItems.push({
      name: 'Админ',
      icon: User,
      url: '/admin',
    });
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 md:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'glass backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Logo />
          
          <NavBar items={navItems} className="hidden md:block" />
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={toggleTheme}
            >
              <Palette className="h-5 w-5" />
            </Button>
            
            {user ? (
              <>
                <UserMenu 
                  displayName={displayName} 
                  onSignOut={handleSignOut} 
                  isAdmin={isAdmin}
                />
                
                <Button 
                  className="hidden md:flex bg-spasi-red hover:bg-spasi-red/90"
                  onClick={() => navigate('/submit-signal')}
                >
                  Подай сигнал
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="hidden md:flex" 
                  onClick={() => navigate('/auth')}
                >
                  Вход
                </Button>
                <Button 
                  className="hidden md:flex bg-spasi-red hover:bg-spasi-red/90"
                  onClick={() => navigate('/auth?signup=true')}
                >
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
