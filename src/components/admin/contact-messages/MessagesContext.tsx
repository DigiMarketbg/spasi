
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ContactMessageData } from '../hooks/useContactMessages';

interface MessagesContextType {
  selectedMessage: ContactMessageData | null;
  isDetailOpen: boolean;
  processingId: string | null;
  isDeleteAllDialogOpen: boolean;
  isDeletingAll: boolean;
  setSelectedMessage: (message: ContactMessageData | null) => void;
  setIsDetailOpen: (isOpen: boolean) => void;
  setProcessingId: (id: string | null) => void;
  setIsDeleteAllDialogOpen: (isOpen: boolean) => void;
  setIsDeletingAll: (isDeleting: boolean) => void;
  handleViewDetails: (message: ContactMessageData) => Promise<void>;
  handleMarkAsRead: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleDeleteAllMessages: () => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

interface MessagesProviderProps {
  children: React.ReactNode;
  onRefresh: () => void;
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children, onRefresh }) => {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleViewDetails = async (message: ContactMessageData) => {
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

  const value = {
    selectedMessage,
    isDetailOpen,
    processingId,
    isDeleteAllDialogOpen,
    isDeletingAll,
    setSelectedMessage,
    setIsDetailOpen,
    setProcessingId,
    setIsDeleteAllDialogOpen,
    setIsDeletingAll,
    handleViewDetails,
    handleMarkAsRead,
    handleDelete,
    handleDeleteAllMessages
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
