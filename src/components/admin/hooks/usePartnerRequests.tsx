
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PartnerRequestData } from './types';

export const usePartnerRequests = (isAdmin: boolean, user: any) => {
  const { toast } = useToast();
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequestData[]>([]);
  const [loadingPartnerRequests, setLoadingPartnerRequests] = useState(true);

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

  // Calculate pending requests count
  const pendingRequestsCount = partnerRequests.filter(req => !req.is_approved).length;

  return {
    partnerRequests,
    loadingPartnerRequests,
    fetchPartnerRequests,
    pendingRequestsCount
  };
};
