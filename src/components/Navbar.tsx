
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

const Navbar = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'glass backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-6">
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
            
            <MobileMenu 
              displayName={displayName}
              handleSignOut={handleSignOut}
              isLoggedIn={!!user}
              isAdmin={isAdmin}
              triggerButton={
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
