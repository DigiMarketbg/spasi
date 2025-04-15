
import React from 'react';
import { Witness } from '@/types/witness';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WitnessActionsProps {
  witness: Witness;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}

const WitnessActions: React.FC<WitnessActionsProps> = ({
  witness,
  onApprove,
  onReject,
  isProcessing
}) => {
  const navigate = useNavigate();
  const isExpired = new Date(witness.expires_at) < new Date();
  
  if (isProcessing) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }
  
  const viewWitness = () => {
    navigate(`/witness/${witness.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Отвори меню</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={viewWitness}>
          <Eye className="h-4 w-4 mr-2" />
          Преглед
        </DropdownMenuItem>
        
        {!witness.is_approved && !isExpired && (
          <DropdownMenuItem 
            onClick={() => onApprove(witness.id)}
            className="text-green-600"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Одобри
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => onReject(witness.id)}
          className="text-destructive"
        >
          <XCircle className="h-4 w-4 mr-2" />
          {witness.is_approved ? 'Изтрий' : 'Отхвърли'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WitnessActions;
