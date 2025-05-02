
import React from 'react';
import Logo from './Logo';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGDPR } from './gdpr/GDPRProvider';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const { openConsentDialog } = useGDPR();
  
  const footerLinks = [
    { name: 'Подай сигнал', href: '/submit-signal' },
    { name: 'Хора в беда', href: '/signals' },
    { name: 'Доброволци', href: '/volunteers' },
    { name: 'За нас', href: '/info' },
    { name: 'Контакт', href: '/contact' },
  ];

  if (isMobile) {
    // Опростен футър за мобилни устройства
    return (
      <footer className="py-10 px-4 border-t bg-black text-white text-center pb-32">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-6">
            <Logo className="mb-6 scale-110" />
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center">
              {footerLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mt-6">
            <button 
              onClick={openConsentDialog}
              className="block mx-auto mb-2 text-gray-400 hover:text-white transition-colors"
            >
              Политика за поверителност
            </button>
            <p>© 2025 Spasi.bg. Всички права запазени.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Десктоп версия на футъра
  return (
    <footer className="py-10 px-4 md:px-6 lg:px-8 border-t">
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
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-2">
            <button 
              onClick={openConsentDialog}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="h-4 w-4 mr-1" />
              Политика за поверителност
            </button>
          </div>
          <p>© 2025 Spasi.bg. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
