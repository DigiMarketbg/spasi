
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface SignalStatusActionsProps {
  isApproved: boolean;
  isResolved: boolean;
  onToggleApproval: (currentValue: boolean) => Promise<void>;
  onToggleResolution: (currentValue: boolean) => Promise<void>;
  labels?: {
    approve: string;
    removeApproval: string;
    markResolved: string;
    markUnresolved: string;
  };
}

const SignalStatusActions: React.FC<SignalStatusActionsProps> = ({
  isApproved,
  isResolved,
  onToggleApproval,
  onToggleResolution,
  labels = {
    approve: 'Одобри сигнала',
    removeApproval: 'Премахни одобрение',
    markResolved: 'Маркирай като разрешен',
    markUnresolved: 'Маркирай като неразрешен'
  }
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button 
        variant={isApproved ? "destructive" : "default"}
        onClick={() => onToggleApproval(isApproved)}
      >
        {isApproved ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
        {isApproved ? labels.removeApproval : labels.approve}
      </Button>
      
      <Button 
        variant={isResolved ? "destructive" : "default"}
        onClick={() => onToggleResolution(isResolved)}
      >
        {isResolved ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
        {isResolved ? labels.markUnresolved : labels.markResolved}
      </Button>
    </div>
  );
};

export default SignalStatusActions;
