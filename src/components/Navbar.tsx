
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { useAuth } from './AuthProvider';
import NavLinks from './navbar/NavLinks';
import ThemeToggle from './navbar/ThemeToggle';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

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

  // Remove hiding navbar on mobile to fix visibility issue
  // if (isMobile) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] py-4 px-4 md:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'glass backdrop-blur-lg shadow-md bg-gray-900/90' : 'bg-gray-900/80'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 mr-4">
            <Logo />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>
          
          <div className="flex items-center gap-4">
            <ThemeToggle className="hidden md:flex" />
            
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
