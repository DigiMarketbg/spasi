
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface DeleteAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

const DeleteAreaDialog: React.FC<DeleteAreaDialogProps> = ({
  open,
  onOpenChange,
  onConfirmDelete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Потвърдете изтриването</DialogTitle>
          <DialogDescription>
            Сигурни ли сте, че искате да изтриете този опасен участък? Това действие не може да бъде отменено.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отказ</Button>
          <Button variant="destructive" onClick={onConfirmDelete}>Изтрий</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAreaDialog;
