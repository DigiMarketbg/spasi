
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import MessagesTable from './contact-messages/MessagesTable';
import MessageDetailDialog from './contact-messages/MessageDetailDialog';
import EmptyState from './contact-messages/EmptyState';
import LoadingState from './contact-messages/LoadingState';
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

interface ContactMessagesProps {
  messages: any[] | undefined;
  loadingMessages: boolean;
  onRefresh: () => void;
}

const ContactMessagesManagement = ({
  messages = [], // Provide a default empty array
  loadingMessages,
  onRefresh,
}: ContactMessagesProps) => {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleViewDetails = async (message: any) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
    
    // Mark as read if not already read
    if (!message.is_read) {
      try {
        await supabase
          .from('contact_messages' as any)
          .update({ is_read: true } as any)
          .eq('id', message.id);
          
        onRefresh();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setProcessingId(id);
      
      const { error } = await supabase
        .from('contact_messages' as any)
        .update({ is_read: true } as any)
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Съобщението беше маркирано като прочетено.',
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при маркирането на съобщението.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setProcessingId(id);
      
      const { error } = await supabase
        .from('contact_messages' as any)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Съобщението беше изтрито успешно.',
      });
      
      onRefresh();
      
      // Close the detail dialog if the deleted message was being viewed
      if (isDetailOpen && selectedMessage?.id === id) {
        setIsDetailOpen(false);
        setSelectedMessage(null);
      }
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при изтриването на съобщението.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleDeleteAllMessages = async () => {
    try {
      setIsDeletingAll(true);
      
      const { error } = await supabase
        .from('contact_messages' as any)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Всички съобщения бяха изтрити успешно.',
      });
      
      // Close any open dialogs
      setIsDeleteAllDialogOpen(false);
      setIsDetailOpen(false);
      setSelectedMessage(null);
      
      onRefresh();
    } catch (error: any) {
      console.error('Error deleting all messages:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при изтриването на съобщенията.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Ensure messages is an array before trying to access its length
  const messagesCount = messages?.length || 0;

  return (
    <div>
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
        
        <Button onClick={onRefresh} variant="outline" size="sm">
          Обнови
        </Button>
      </div>

      {loadingMessages ? (
        <LoadingState />
      ) : messagesCount === 0 ? (
        <EmptyState />
      ) : (
        <MessagesTable 
          messages={messages || []}
          onViewMessage={handleViewDetails}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          processingId={processingId}
        />
      )}
      
      <MessageDetailDialog
        message={selectedMessage}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
        processingId={processingId}
      />
    </div>
  );
};

export default ContactMessagesManagement;
