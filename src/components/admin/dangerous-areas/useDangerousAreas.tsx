
import { useState, useCallback } from 'react';
import { fetchAllDangerousAreas, updateDangerousAreaApproval, deleteDangerousArea } from '@/lib/api/dangerous-areas';
import { DangerousArea } from '@/types/dangerous-area';
import { useToast } from '@/hooks/use-toast';

export const useDangerousAreas = (onExternalRefresh?: () => void) => {
  const [areas, setAreas] = useState<DangerousArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingApproval, setProcessingApproval] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAreas = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const allAreas = await fetchAllDangerousAreas();
      console.log("Fetched areas in hook:", allAreas);
      setAreas(allAreas);
    } catch (error) {
      console.error("Error fetching areas:", error);
      setError("Не успяхме да заредим опасните участъци");
      toast({
        title: "Грешка",
        description: "Не успяхме да заредим опасните участъци",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleApprove = async (id: string) => {
    try {
      console.log(`[handleApprove] Starting to approve area with ID: ${id}`);
      setProcessingApproval(id);
      setError(null);
      
      // First update in Supabase database
      await updateDangerousAreaApproval(id, true);
      console.log("[handleApprove] Area successfully approved in database");
      
      // Then update the local state immediately
      setAreas(prevAreas => 
        prevAreas.map(area => 
          area.id === id ? {...area, is_approved: true} : area
        )
      );
      
      toast({
        title: "Успешно",
        description: "Опасният участък беше одобрен",
      });
      
      // Notify parent component if callback exists
      if (onExternalRefresh) {
        console.log("[handleApprove] Triggering external refresh");
        onExternalRefresh();
      }
      
      // Finally refresh areas from database to ensure sync
      await fetchAreas();
      
      return true;
    } catch (error: any) {
      console.error("[handleApprove] Error approving area:", error);
      const errorMessage = error.message || "Не успяхме да одобрим опасния участък";
      setError(errorMessage);
      
      toast({
        title: "Грешка",
        description: errorMessage,
        variant: "destructive"
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
      
      toast({
        title: "Успешно",
        description: "Опасният участък беше изтрит",
      });
      
      if (onExternalRefresh) {
        onExternalRefresh();
      }
    } catch (error) {
      console.error("Error deleting area:", error);
      setError("Не успяхме да изтрием опасния участък");
      toast({
        title: "Грешка",
        description: "Не успяхме да изтрием опасния участък",
        variant: "destructive"
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
