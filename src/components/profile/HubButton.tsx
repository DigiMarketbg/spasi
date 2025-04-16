
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
}

const HubButton: React.FC<HubButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'default',
  active = false
}) => {
  // Color variants mapping
  const variantStyles = {
    default: "bg-card hover:bg-muted/80",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center h-24 w-full p-2 gap-2 shadow-sm border",
        "transition-all duration-200 hover:shadow-md",
        variantStyles[variant],
        active && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <Icon className="h-8 w-8" />
      <span className="text-sm font-medium text-center">{label}</span>
    </Button>
  );
};

export default HubButton;
