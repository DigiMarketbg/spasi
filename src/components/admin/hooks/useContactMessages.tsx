
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const useContactMessages = (isEnabled: boolean) => {
  const { toast } = useToast();
  const [contactMessages, setContactMessages] = useState<ContactMessageData[]>([]);
  const [loadingContactMessages, setLoadingContactMessages] = useState(true);

  // Fetch contact messages
  const fetchContactMessages = useCallback(async () => {
    if (!isEnabled) return;

    setLoadingContactMessages(true);
    try {
      // Using any here to avoid TypeScript errors until Supabase types are properly updated
      const { data, error } = await supabase
        .from('contact_messages' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Correctly cast the data to the expected type
      setContactMessages(data as unknown as ContactMessageData[] || []);
    } catch (error: any) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на съобщенията.",
        variant: "destructive",
      });
      setContactMessages([]);
    } finally {
      setLoadingContactMessages(false);
    }
  }, [isEnabled, toast]);

  // Calculate unread count
  const unreadCount = contactMessages.filter(msg => !msg.is_read).length;

  return {
    contactMessages,
    loadingContactMessages,
    fetchContactMessages,
    unreadCount
  };
};
