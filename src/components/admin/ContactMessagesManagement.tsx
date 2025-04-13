
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import MessagesTable from './contact-messages/MessagesTable';
import MessageDetailDialog from './contact-messages/MessageDetailDialog';
import EmptyState from './contact-messages/EmptyState';
import LoadingState from './contact-messages/LoadingState';

interface ContactMessagesProps {
  messages: any[];
  loadingMessages: boolean;
  onRefresh: () => void;
}

const ContactMessagesManagement = ({
  messages,
  loadingMessages,
  onRefresh,
}: ContactMessagesProps) => {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
      
      if (isDetailOpen && selectedMessage?.id === id) {
        setIsDetailOpen(false);
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

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={onRefresh} variant="outline" size="sm">
          Обнови
        </Button>
      </div>

      {loadingMessages ? (
        <LoadingState />
      ) : messages.length === 0 ? (
        <EmptyState />
      ) : (
        <MessagesTable 
          messages={messages}
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
