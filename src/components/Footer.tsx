
import React from 'react';
import Logo from './Logo';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer = () => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  
  const footerLinks = [
    { name: 'Подай сигнал', href: '#' },
    { name: 'Хора в беда', href: '#' },
    { name: 'Доброволци', href: '#' },
    { name: 'За нас', href: '#' },
    { name: 'Контакт', href: '#' },
  ];

  return (
    <footer className={`py-10 px-4 md:px-6 lg:px-8 border-t ${isMobile ? 'pb-32' : ''}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo className="mb-2 md:mb-0" />
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {!isMobile && (
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>© 2025 Spasi.bg. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
