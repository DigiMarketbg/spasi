
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
import { useMessages } from './MessagesContext';

interface MessageControlsProps {
  messagesCount: number;
}

const MessageControls: React.FC<MessageControlsProps> = ({ messagesCount }) => {
  const {
    isDeleteAllDialogOpen,
    setIsDeleteAllDialogOpen,
    isDeletingAll,
    handleDeleteAllMessages
  } = useMessages();

  return (
    <div className="mb-4 flex justify-between">
      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={messagesCount === 0 || isDeletingAll}
          >
            <Trash2 className="h-4 w-4" />
            Изтрий всички съобщения
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изтриване на всички съобщения</AlertDialogTitle>
            <AlertDialogDescription>
              Сигурни ли сте, че искате да изтриете ВСИЧКИ съобщения? Това действие не може да бъде отменено и ще изтрие всички {messagesCount} съобщения.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отказ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAllMessages} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeletingAll}
            >
              {isDeletingAll ? 'Изтриване...' : 'Изтрий всички'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Button onClick={() => window.location.reload()} variant="outline" size="sm">
        Обнови
      </Button>
    </div>
  );
};

export default MessageControls;
