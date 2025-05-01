
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
import { useMessages } from './MessagesContext';
import { ContactMessageData } from '../hooks/useContactMessages';

interface MessageActionsProps {
  message: ContactMessageData;
}

const MessageActions = ({ message }: MessageActionsProps) => {
  const [open, setOpen] = useState(false);
  const { handleViewDetails, handleMarkAsRead, handleDelete, processingId } = useMessages();

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleViewDetails(message)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {!message.is_read && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600"
          onClick={() => handleMarkAsRead(message.id)}
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
            <AlertDialogAction 
              onClick={() => {
                handleDelete(message.id);
                setOpen(false);
              }} 
              className="bg-red-600 hover:bg-red-700"
            >
              Изтрий
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MessageActions;
