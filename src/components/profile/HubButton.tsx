
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HubButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  active?: boolean;
  fullWidth?: boolean;
  size?: 'default' | 'large' | 'small';
}

const HubButton: React.FC<HubButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'default',
  active = false,
  fullWidth = true,
  size = 'default'
}) => {
  // Color variants mapping
  const variantStyles = {
    default: "bg-card hover:bg-muted/80",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  
  // Size variants
  const sizeStyles = {
    small: "h-16 p-1 gap-1",
    default: "h-24 p-2 gap-2",
    large: "h-32 p-3 gap-3"
  };
  
  const iconSizes = {
    small: "h-6 w-6",
    default: "h-8 w-8",
    large: "h-10 w-10"
  };
  
  const textSizes = {
    small: "text-[10px] leading-tight truncate max-w-full",
    default: "text-xs leading-tight truncate max-w-full",
    large: "text-sm leading-tight truncate max-w-full"
  };
  
  // Shorten labels for better mobile fit
  const shortenedLabel = label.length > 12 
    ? label.substring(0, 10) + '...' 
    : label;
  
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full p-2 gap-2 shadow-sm border",
        "transition-all duration-200 hover:shadow-md",
        variantStyles[variant],
        sizeStyles[size],
        active && "ring-2 ring-primary ring-offset-2",
        fullWidth ? "w-full" : ""
      )}
    >
      <Icon className={iconSizes[size]} />
      <span 
        className={cn(
          "font-medium text-center overflow-hidden whitespace-nowrap", 
          textSizes[size]
        )}
        title={label} // Show full label on hover
      >
        {shortenedLabel}
      </span>
    </Button>
  );
};

export default HubButton;
