
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../ThemeProvider';

interface ThemeToggleProps {
  variant?: 'icon' | 'text';
  className?: string;
}

const ThemeToggle = ({ variant = 'icon', className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  
  if (variant === 'text') {
    return (
      <Button onClick={toggleTheme} variant="outline" className={`justify-start ${className}`}>
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
    );
  }
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={`rounded-full ${className}`}
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
