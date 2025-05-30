
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Plus, Info, User, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import MobileProfileDrawer from './profile/MobileProfileDrawer';

const MobileNavBar = () => {
  const location = useLocation();
  const { user, profile, isModerator, isAdmin, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  if (!isMobile) return null;

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Потребител';
  
  // Simple direct navigation without manipulating tabs
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

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
      name: 'Сигнал',
      icon: Plus,
      path: '/submit-signal',
    },
    {
      name: 'Инфо',
      icon: Info, 
      path: '/info',
    },
    {
      name: user ? 'Профил' : 'Вход',
      icon: User,
      path: '#',
      isProfileButton: true,
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
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

      {/* Bottom navigation with tubelight effect */}
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = !item.isProfileButton && location.pathname === item.path;
          
          if (item.isProfileButton && user) {
            return (
              <MobileProfileDrawer
                key={item.name}
                displayName={displayName}
                userEmail={user?.email}
                fullName={profile?.full_name}
                activeTab="profile"
                setActiveTab={() => {}}
                isModerator={!!isModerator}
                isAdmin={!!isAdmin}
                signOut={signOut}
                navigateToPath={handleNavigate}
                triggerButton={
                  <div
                    className={cn(
                      "relative flex flex-col items-center justify-center w-full h-full px-1",
                      "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="relative">
                      <User className="h-5 w-5 mb-1 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] text-center w-full overflow-hidden whitespace-nowrap text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                }
              />
            );
          }
          
          if (item.isProfileButton && !user) {
            return (
              <Link
                key={item.name}
                to="/auth"
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-full px-1",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <User className="h-5 w-5 mb-1 text-muted-foreground" />
                </div>
                <span className="text-[10px] text-center w-full overflow-hidden whitespace-nowrap text-muted-foreground">
                  Вход
                </span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full px-1",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="mobileTubelight"
                    className="absolute -inset-1 rounded-full bg-primary/10 -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-8 h-4 bg-primary/20 rounded-full blur-md -top-1 -left-1" />
                      <div className="absolute w-6 h-4 bg-primary/20 rounded-full blur-md -top-0.5" />
                      <div className="absolute w-3 h-3 bg-primary/20 rounded-full blur-sm top-0 left-1.5" />
                    </div>
                  </motion.div>
                )}
                <item.icon className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <span className={cn(
                "text-[10px] text-center w-full overflow-hidden whitespace-nowrap",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>{item.name}</span>
            </Link>
          );
        })}
      </div>
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-area-bottom bg-background" />
    </div>
  );
};

export default MobileNavBar;
