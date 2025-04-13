
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface SignalStatusActionsProps {
  isApproved: boolean;
  isResolved: boolean;
  onToggleApproval: (currentValue: boolean) => Promise<void>;
  onToggleResolution: (currentValue: boolean) => Promise<void>;
}

const SignalStatusActions: React.FC<SignalStatusActionsProps> = ({
  isApproved,
  isResolved,
  onToggleApproval,
  onToggleResolution
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button 
        variant={isApproved ? "destructive" : "default"}
        onClick={() => onToggleApproval(isApproved)}
      >
        {isApproved ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
        {isApproved ? 'Премахни одобрение' : 'Одобри сигнала'}
      </Button>
      
      <Button 
        variant={isResolved ? "destructive" : "default"}
        onClick={() => onToggleResolution(isResolved)}
      >
        {isResolved ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
        {isResolved ? 'Маркирай като неразрешен' : 'Маркирай като разрешен'}
      </Button>
    </div>
  );
};

export default SignalStatusActions;
