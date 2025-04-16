
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';

interface WitnessStatusActionsProps {
  isApproved: boolean;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  isProcessing: boolean;
}

const WitnessStatusActions: React.FC<WitnessStatusActionsProps> = ({
  isApproved,
  onApprove,
  onReject,
  isProcessing
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {!isApproved && (
        <Button 
          variant="default"
          onClick={onApprove}
          disabled={isProcessing}
        >
          <Check className="h-4 w-4 mr-2" />
          Одобри обявата
        </Button>
      )}
      
      <Button 
        variant="destructive"
        onClick={onReject}
        disabled={isProcessing}
      >
        {isApproved ? <Trash2 className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
        {isApproved ? 'Изтрий обявата' : 'Отхвърли обявата'}
      </Button>
    </div>
  );
};

export default WitnessStatusActions;
