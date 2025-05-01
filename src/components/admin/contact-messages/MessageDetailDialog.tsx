
import React, { useState } from 'react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface MessageDetailDialogProps {
  message: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  processingId: string | null;
}

const MessageDetailDialog = ({
  message,
  isOpen,
  onOpenChange,
  onMarkAsRead,
  onDelete,
  processingId,
}: MessageDetailDialogProps) => {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
  if (!message) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy, HH:mm', { locale: bg });
    } catch {
      return dateString;
    }
  };

  const handleDelete = () => {
    onDelete(message.id);
    setDeleteAlertOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Детайли за съобщението</DialogTitle>
          <DialogDescription>
            Съобщение от {message?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="flex justify-between items-center">
            <div className="font-semibold text-lg">
              {message.subject || "Общо запитване"}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(message.created_at)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">От:</div>
              <div>{message.name}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Имейл:</div>
              <div className="break-all">{message.email}</div>
            </div>
          </div>
          
          {message.phone && (
            <div>
              <div className="text-sm text-muted-foreground">Телефон:</div>
              <div>{message.phone}</div>
            </div>
          )}
          
          <div>
            <div className="text-sm text-muted-foreground">Съобщение:</div>
            <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            {!message.is_read && (
              <Button 
                variant="outline"
                onClick={() => onMarkAsRead(message.id)}
                disabled={processingId === message.id}
              >
                {processingId === message.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Маркирай като прочетено
              </Button>
            )}
            
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  disabled={processingId === message.id}
                >
                  {processingId === message.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Изтрий
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailDialog;
