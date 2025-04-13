
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, X, Trash2 } from 'lucide-react';

interface SignalActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const SignalActions: React.FC<SignalActionsProps> = ({ 
  isEditing, 
  onEdit, 
  onCancel, 
  onDelete 
}) => {
  return (
    <div className="flex gap-2">
      {isEditing ? (
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Отказ
        </Button>
      ) : (
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Редактирай
        </Button>
      )}
      <Button variant="destructive" onClick={onDelete}>
        <Trash2 className="h-4 w-4 mr-2" />
        Изтрий
      </Button>
    </div>
  );
};

export default SignalActions;
