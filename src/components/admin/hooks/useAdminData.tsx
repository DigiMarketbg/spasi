
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchAllSignals } from '@/lib/api/signals';
import { Signal } from '@/types/signal';

export interface SignalData {
  id: string;
  title: string;
  category: string;
  city: string;
  created_at: string;
  is_approved: boolean;
  is_resolved: boolean;
  user_id: string;
  user_full_name?: string;
  user_email?: string;
  status: string;
}

export interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean | null;
}

export interface PartnerRequestData {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  message: string | null;
  logo_url: string | null;
  created_at: string;
  is_approved: boolean;
}

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

export const useAdminData = (isAdmin: boolean, user: any) => {
  const { toast } = useToast();
  
  // State for signals and users
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequestData[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessageData[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPartnerRequests, setLoadingPartnerRequests] = useState(true);
  const [loadingContactMessages, setLoadingContactMessages] = useState(true);

  // Fetch signals data with better error handling
  const fetchSignals = useCallback(async () => {
    setLoadingSignals(true);
    try {
      console.log("Fetching signals...");
      
      // Using our dedicated function to fetch all signals
      const signalsData = await fetchAllSignals();
      
      if (!signalsData || signalsData.length === 0) {
        setSignals([]);
        setLoadingSignals(false);
        return;
      }
      
      // Process the signals for display
      const enrichedSignals = signalsData.map(signal => {
        return {
          id: signal.id,
          title: signal.title,
          category: signal.category,
          city: signal.city,
          description: signal.description,
          created_at: signal.created_at,
          is_approved: signal.is_approved,
          is_resolved: signal.is_resolved,
          status: signal.status,
          user_id: signal.user_id,
          user_full_name: signal.profiles?.full_name || 'Неизвестен',
          user_email: signal.profiles?.email || 'Неизвестен имейл'
        };
      });
      
      setSignals(enrichedSignals);
    } catch (error: any) {
      console.error('Error fetching signals:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на сигналите: " + (error.message || error),
        variant: "destructive",
      });
      setSignals([]);
    } finally {
      setLoadingSignals(false);
    }
  }, [toast]);

  // Fetch users data
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на потребителите.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch partner requests
  const fetchPartnerRequests = async () => {
    setLoadingPartnerRequests(true);
    try {
      const { data, error } = await supabase
        .from('partners_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartnerRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching partner requests:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на партньорските заявки.",
        variant: "destructive",
      });
      setPartnerRequests([]);
    } finally {
      setLoadingPartnerRequests(false);
    }
  };

  // Fetch contact messages
  const fetchContactMessages = async () => {
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
  };

  // Load data when component mounts or admin status changes
  useEffect(() => {
    if (user && isAdmin) {
      fetchSignals();
      fetchUsers();
      fetchPartnerRequests();
      fetchContactMessages();
    }
  }, [user, isAdmin, fetchSignals]);

  // Calculate unread count
  const unreadCount = contactMessages.filter(msg => !msg.is_read).length;
  
  // Calculate pending requests count
  const pendingRequestsCount = partnerRequests.filter(req => !req.is_approved).length;

  return {
    signals,
    users,
    partnerRequests,
    contactMessages,
    loadingSignals,
    loadingUsers,
    loadingPartnerRequests,
    loadingContactMessages,
    fetchSignals,
    fetchUsers,
    fetchPartnerRequests,
    fetchContactMessages,
    unreadCount,
    pendingRequestsCount
  };
};
