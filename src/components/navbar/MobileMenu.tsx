
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogOut, Settings } from 'lucide-react'; // Add Settings icon
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../AuthProvider';

interface MobileMenuProps {
  displayName: string;
  triggerButton: React.ReactNode;
  handleSignOut: () => Promise<void>;
  isLoggedIn: boolean;
  isAdmin?: boolean; // Add the isAdmin prop
}

const MobileMenu = ({ displayName, triggerButton, handleSignOut, isLoggedIn, isAdmin = false }: MobileMenuProps) => {
  const navigate = useNavigate();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        {triggerButton}
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
            <NavLinks />
          </nav>
          
          <div className="mt-auto flex flex-col gap-4 py-4">
            <ThemeToggle variant="text" />
          
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 text-foreground font-medium">
                  {displayName}
                </div>
                
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/admin')}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Админ панел</span>
                  </Button>
                )}
                
                <Button 
                  className="bg-spasi-red hover:bg-spasi-red/90"
                  onClick={() => navigate('/submit-signal')}
                >
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
  );
};

export default MobileMenu;
