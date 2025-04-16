
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchAllSignals } from '@/lib/api/signals';
import { SignalData } from './types';

export const useSignals = (isAdmin: boolean, user: any) => {
  const { toast } = useToast();
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);

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

  return {
    signals,
    loadingSignals,
    fetchSignals
  };
};
