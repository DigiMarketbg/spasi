
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
      console.log(`[handleApprove] Attempting to approve area with ID: ${id}`);
      setProcessingApproval(id);
      setError(null);
      
      // Първо обновяваме локалното състояние за по-добро потребителско преживяване
      setAreas(prevAreas => 
        prevAreas.map(area => 
          area.id === id ? { ...area, is_approved: true } : area
        )
      );
      
      // След това правим API заявката
      await updateDangerousAreaApproval(id, true);
      
      console.log("[handleApprove] Area successfully approved, updating UI");
      
      // Обновяваме данните от сървъра за да сме сигурни в консистентността
      await fetchAreas();
      
      toast({
        title: "Успешно",
        description: "Опасният участък беше одобрен",
      });
      
      // Известяваме родителския компонент за промяната
      if (onExternalRefresh) onExternalRefresh();
    } catch (error) {
      console.error("[handleApprove] Error approving area:", error);
      setError("Не успяхме да одобрим опасния участък");
      
      // Връщаме локалното състояние при грешка
      await fetchAreas();
      
      toast({
        title: "Грешка",
        description: "Не успяхме да одобрим опасния участък",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setProcessingApproval(null);
      setLoading(false);
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
      
      // Refresh data to ensure consistency
      await fetchAreas();
      
      if (onExternalRefresh) onExternalRefresh();
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
