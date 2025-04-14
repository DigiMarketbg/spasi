
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
import { Trash2, Loader2 } from 'lucide-react';

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
  const handleDeleteClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    
    try {
      await onDeleteAll();
      onOpenChange(false);
    } catch (error) {
      console.error("Error during bulk deletion:", error);
      // Error handling is managed by the parent component
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-1 mb-2 sm:mb-0"
          disabled={signalsCount === 0 || isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
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
          <AlertDialogCancel disabled={isDeleting}>Отказ</AlertDialogCancel>
          <Button 
            onClick={handleDeleteClick} 
            variant="destructive"
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Изтриване...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Изтрий всички
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllDialog;
