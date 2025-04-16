
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllSignals } from '@/lib/api/signals';
import { fetchAllDangerousAreas } from '@/lib/api/dangerous-areas';
import { Signal } from '@/types/signal';
import { toast } from 'sonner';

export const useModeratorData = (isAuthorized: boolean) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Function to trigger refreshing of all data
  const handleRefresh = useCallback(() => {
    console.log("Triggering refresh in Moderator page, current key:", refreshKey);
    setRefreshKey(prev => prev + 1);
    setError(null); // Clear errors on refresh
  }, [refreshKey]);

  // Fetch signals for moderators
  const {
    data: signals = [],
    isLoading: loadingSignals,
    error: signalsError,
    refetch: refetchSignals
  } = useQuery({
    queryKey: ['moderator-signals', refreshKey],
    queryFn: async () => {
      if (!isAuthorized) return [];
      try {
        // Get all signals using our dedicated function
        const signalsData = await fetchAllSignals();
        if (!signalsData || signalsData.length === 0) {
          return [];
        }

        // Process the data for display
        const enrichedSignals = signalsData.map((signal: Signal) => {
          return {
            ...signal,
            user_full_name: signal.profiles?.full_name || 'Неизвестен',
            user_email: signal.profiles?.email || 'Неизвестен имейл'
          };
        });
        console.log("Successfully processed signals for moderator view:", enrichedSignals);
        return enrichedSignals;
      } catch (error: any) {
        console.error("Error fetching signals for moderator:", error);
        setError(`Грешка при зареждане на сигналите: ${error.message || error}`);
        return [];
      }
    },
    enabled: isAuthorized,
    meta: {
      onError: (err: any) => {
        setError(`Грешка при зареждане на сигналите: ${err.message || 'Неизвестна грешка'}`);
      }
    }
  });

  // Fetch dangerous areas for moderators
  const {
    data: dangerousAreas = [],
    isLoading: loadingDangerousAreas,
    error: dangerousAreasError,
    refetch: refetchDangerousAreas
  } = useQuery({
    queryKey: ['moderator-dangerous-areas', refreshKey],
    queryFn: async () => {
      if (!isAuthorized) return [];
      try {
        // Get all dangerous areas
        return await fetchAllDangerousAreas();
      } catch (error: any) {
        console.error("Error fetching dangerous areas for moderator:", error);
        setError(`Грешка при зареждане на опасните участъци: ${error.message || error}`);
        return [];
      }
    },
    enabled: isAuthorized,
    meta: {
      onError: (err: any) => {
        setError(`Грешка при зареждане на опасните участъци: ${err.message || 'Неизвестна грешка'}`);
      }
    }
  });

  // Display toast for errors
  if (signalsError || dangerousAreasError) {
    toast.error('Възникна проблем при зареждането на данните', {
      description: 'Моля, опитайте отново чрез бутона за обновяване'
    });
  }

  return {
    signals,
    dangerousAreas,
    loadingSignals,
    loadingDangerousAreas,
    error,
    handleRefresh,
    refetchSignals,
    refetchDangerousAreas
  };
};
