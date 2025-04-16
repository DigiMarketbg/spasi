
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface ProfileHubButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  dropdown?: DropdownItem[];
}

const ProfileHubButton: React.FC<ProfileHubButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  dropdown
}) => {
  if (dropdown) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 rounded-full bg-card shadow-md hover:shadow-lg transition-all"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {dropdown.map((item, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    onClick={item.onClick}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-12 w-12 rounded-full bg-card shadow-md hover:shadow-lg transition-all"
            onClick={onClick}
          >
            <Icon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProfileHubButton;
