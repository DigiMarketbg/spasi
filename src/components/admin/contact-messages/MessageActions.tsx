
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check, Trash2, Loader2 } from 'lucide-react';
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

interface MessageActionsProps {
  message: any;
  onView: (message: any) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  processingId: string | null;
}

const MessageActions = ({ 
  message, 
  onView, 
  onMarkAsRead, 
  onDelete, 
  processingId 
}: MessageActionsProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(message.id);
    setOpen(false);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onView(message)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {!message.is_read && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600"
          onClick={() => onMarkAsRead(message.id)}
          disabled={processingId === message.id}
        >
          {processingId === message.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
      )}
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600"
            disabled={processingId === message.id}
          >
            {processingId === message.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изтриване на съобщение</AlertDialogTitle>
            <AlertDialogDescription>
              Сигурни ли сте, че искате да изтриете това съобщение? Това действие не може да бъде отменено.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отказ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Изтрий
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MessageActions;
