
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { Sun, Moon, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { name: 'Начало', href: '/' },
  { name: 'Сигнали', href: '#' },
  { name: 'Доброволци', href: '#' },
  { name: 'Партньори', href: '#' },
  { name: 'За нас', href: '#' }
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
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
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full hidden md:flex" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hidden md:flex">
                      <UserIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Моят профил</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Изход</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button className="hidden md:flex bg-spasi-red hover:bg-spasi-red/90">
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
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Logo />
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  
                  <nav className="flex flex-col gap-4 py-8">
                    {navLinks.map((link) => (
                      <a 
                        key={link.name}
                        href={link.href}
                        className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      >
                        {link.name}
                      </a>
                    ))}
                  </nav>
                  
                  <div className="mt-auto flex flex-col gap-4 py-4">
                    <Button onClick={toggleTheme} variant="outline" className="justify-start">
                      {theme === 'dark' ? (
                        <>
                          <Sun className="h-5 w-5 mr-2" />
                          <span>Светла тема</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5 mr-2" />
                          <span>Тъмна тема</span>
                        </>
                      )}
                    </Button>
                    
                    {user ? (
                      <>
                        <Button className="bg-spasi-red hover:bg-spasi-red/90">
                          Подай сигнал
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          <span>Изход</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => navigate('/auth')} 
                          variant="outline"
                        >
                          Вход
                        </Button>
                        <Button 
                          className="bg-spasi-red hover:bg-spasi-red/90"
                          onClick={() => navigate('/auth?signup=true')}
                        >
                          Регистрация
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
