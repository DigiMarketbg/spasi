
import { useState, useEffect } from 'react';
import { fetchAllDangerousAreas } from '@/lib/api/dangerous-areas';
import { toast } from 'sonner';

export const useDangerousAreas = (isEnabled: boolean) => {
  const [pendingDangerousAreas, setPendingDangerousAreas] = useState(0);
  const [loadingDangerousAreas, setLoadingDangerousAreas] = useState(true);

  useEffect(() => {
    if (isEnabled) {
      const getPendingDangerousAreas = async () => {
        try {
          setLoadingDangerousAreas(true);
          const areas = await fetchAllDangerousAreas();
          console.log("Fetched dangerous areas in Admin:", areas);
          const pendingCount = areas.filter(area => !area.is_approved).length;
          setPendingDangerousAreas(pendingCount);
        } catch (error) {
          console.error("Error fetching dangerous areas:", error);
          toast.error("Грешка при зареждане на опасните участъци");
        } finally {
          setLoadingDangerousAreas(false);
        }
      };
      
      getPendingDangerousAreas();
    }
  }, [isEnabled]);

  return {
    pendingDangerousAreas,
    loadingDangerousAreas
  };
};
