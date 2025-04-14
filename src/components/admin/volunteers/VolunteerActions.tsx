
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, CheckIcon, XIcon } from 'lucide-react';

interface VolunteerActionsProps {
  id: string;
  isApproved: boolean;
  onApprove: (id: string, approved: boolean) => Promise<void>;
}

const VolunteerActions: React.FC<VolunteerActionsProps> = ({
  id,
  isApproved,
  onApprove,
}) => {
  const { toast } = useToast();

  return (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          // View details functionality to be implemented
          toast({
            title: "Информация",
            description: "Функционалността за преглед на детайли ще бъде добавена скоро.",
          });
        }}
      >
        <EyeIcon className="h-4 w-4" />
      </Button>
      {isApproved ? (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onApprove(id, false)}
        >
          <XIcon className="h-4 w-4 text-red-500" />
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onApprove(id, true)}
        >
          <CheckIcon className="h-4 w-4 text-green-500" />
        </Button>
      )}
    </div>
  );
};

export default VolunteerActions;
