
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVolunteersData = (isEnabled: boolean) => {
  const { toast } = useToast();
  const [pendingVolunteersCount, setPendingVolunteersCount] = useState(0);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  const fetchVolunteersCount = useCallback(async () => {
    if (!isEnabled) return;
    
    setLoadingVolunteers(true);
    try {
      const { count, error } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      if (error) throw error;
      
      setPendingVolunteersCount(count || 0);
    } catch (error: any) {
      console.error('Error fetching volunteers count:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на данни за доброволци.",
        variant: "destructive",
      });
    } finally {
      setLoadingVolunteers(false);
    }
  }, [isEnabled, toast]);

  return {
    pendingVolunteersCount,
    loadingVolunteers,
    fetchVolunteersCount
  };
};
