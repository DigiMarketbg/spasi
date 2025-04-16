
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const usePartnerRequests = (isEnabled: boolean) => {
  const { toast } = useToast();
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequestData[]>([]);
  const [loadingPartnerRequests, setLoadingPartnerRequests] = useState(true);

  // Fetch partner requests
  const fetchPartnerRequests = useCallback(async () => {
    if (!isEnabled) return;

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
  }, [isEnabled, toast]);

  // Calculate pending requests count
  const pendingRequestsCount = partnerRequests.filter(req => !req.is_approved).length;

  return {
    partnerRequests,
    loadingPartnerRequests,
    fetchPartnerRequests,
    pendingRequestsCount
  };
};
