
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteAllDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteAll: () => Promise<void>;
  isDeleting: boolean;
  signalsCount: number;
}

const DeleteAllDialog: React.FC<DeleteAllDialogProps> = ({
  isOpen,
  onOpenChange,
  onDeleteAll,
  isDeleting,
  signalsCount
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-1 mb-2 sm:mb-0"
          disabled={signalsCount === 0 || isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          Изтрий всички сигнали
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Изтриване на всички сигнали</AlertDialogTitle>
          <AlertDialogDescription>
            Сигурни ли сте, че искате да изтриете ВСИЧКИ сигнали? Това действие не може да бъде отменено и ще изтрие всички {signalsCount} сигнала.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отказ</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDeleteAll} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? 'Изтриване...' : 'Изтрий всички'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllDialog;
