
import { useState, useCallback } from 'react';
import { fetchAllDangerousAreas, updateDangerousAreaApproval, deleteDangerousArea } from '@/lib/api/dangerous-areas';
import { DangerousArea } from '@/types/dangerous-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useDangerousAreas = (onExternalRefresh?: () => void) => {
  const [areas, setAreas] = useState<DangerousArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingApproval, setProcessingApproval] = useState<string | null>(null);

  const fetchAreas = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const allAreas = await fetchAllDangerousAreas();
      console.log("Fetched areas in hook:", allAreas);
      setAreas(allAreas);
    } catch (error: any) {
      console.error("Error fetching areas:", error);
      setError("Не успяхме да заредим опасните участъци");
      toast.error("Не успяхме да заредим опасните участъци", {
        description: error.message || "Моля, опитайте отново",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id: string) => {
    try {
      console.log(`[handleApprove] Starting to approve area with ID: ${id}`);
      setProcessingApproval(id);
      setError(null);
      
      // Direct update via Supabase client for more reliable operation
      const { error: updateError } = await supabase
        .from('dangerous_areas')
        .update({ is_approved: true })
        .eq('id', id);
        
      if (updateError) {
        throw updateError;
      }
      
      console.log("[handleApprove] Area successfully approved in database");
      
      // Update local state immediately to show change
      setAreas(prevAreas => 
        prevAreas.map(area => 
          area.id === id ? {...area, is_approved: true} : area
        )
      );
      
      toast.success("Опасният участък беше одобрен успешно");
      
      // Notify parent component if callback exists
      if (onExternalRefresh) {
        console.log("[handleApprove] Triggering external refresh");
        onExternalRefresh();
      }
      
      // Also refresh from database to ensure everything is in sync
      await fetchAreas();
      
      return true;
    } catch (error: any) {
      console.error("[handleApprove] Error approving area:", error);
      const errorMessage = error.message || "Не успяхме да одобрим опасния участък";
      setError(errorMessage);
      
      toast.error("Грешка при одобряване", {
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setProcessingApproval(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDangerousArea(id);
      
      // Update local state
      setAreas(prevAreas => prevAreas.filter(area => area.id !== id));
      
      toast.success("Опасният участък беше изтрит успешно");
      
      if (onExternalRefresh) {
        onExternalRefresh();
      }
    } catch (error: any) {
      console.error("Error deleting area:", error);
      setError("Не успяхме да изтрием опасния участък");
      toast.error("Грешка при изтриване", {
        description: error.message || "Моля, опитайте отново",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    areas,
    loading,
    error,
    processingApproval,
    fetchAreas,
    handleApprove,
    handleDelete,
    setError
  };
};
