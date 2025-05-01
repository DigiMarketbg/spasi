
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWitnessesData = (isEnabled: boolean) => {
  const { toast } = useToast();
  const [pendingWitnessesCount, setPendingWitnessesCount] = useState(0);
  const [loadingWitnesses, setLoadingWitnesses] = useState(false);

  const fetchWitnessesCount = useCallback(async () => {
    if (!isEnabled) return;
    
    setLoadingWitnesses(true);
    try {
      const { count, error } = await supabase
        .from('witnesses')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      if (error) throw error;
      
      setPendingWitnessesCount(count || 0);
    } catch (error: any) {
      console.error('Error fetching witnesses count:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на данни за свидетели.",
        variant: "destructive",
      });
    } finally {
      setLoadingWitnesses(false);
    }
  }, [isEnabled, toast]);

  return {
    pendingWitnessesCount,
    loadingWitnesses,
    fetchWitnessesCount
  };
};
