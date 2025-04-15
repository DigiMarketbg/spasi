
import React, { useState, useEffect } from 'react';
import { fetchAllDangerousAreas, updateDangerousAreaApproval, deleteDangerousArea } from '@/lib/api/dangerous-areas';
import { DangerousArea } from '@/types/dangerous-area';
import { useToast } from '@/hooks/use-toast';
import DangerousAreasList from '@/components/dangerous-areas/DangerousAreasList';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface DangerousAreasManagementProps {
  onRefresh?: () => void;
}

const DangerousAreasManagement: React.FC<DangerousAreasManagementProps> = ({ onRefresh }) => {
  const [areas, setAreas] = useState<DangerousArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAreas = async () => {
    try {
      setError(null);
      setLoading(true);
      const allAreas = await fetchAllDangerousAreas();
      console.log("Fetched areas in component:", allAreas);
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
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      console.log(`[handleApprove] Attempting to approve area with ID: ${id}`);
      setLoading(true);
      setError(null);
      
      // Update the area approval status
      const updatedArea = await updateDangerousAreaApproval(id, true);
      
      console.log("[handleApprove] Approval response:", updatedArea);
      
      // Immediately update the UI with the updated area
      setAreas(prevAreas => 
        prevAreas.map(area => 
          area.id === id ? { ...area, is_approved: true } : area
        )
      );
      
      // Refresh the entire list to ensure consistency
      await fetchAreas();
      
      toast({
        title: "Успешно",
        description: "Опасният участък беше одобрен",
      });
      
      // Notify parent component of the change
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("[handleApprove] Error approving area:", error);
      setError("Не успяхме да одобрим опасния участък");
      toast({
        title: "Грешка",
        description: "Не успяхме да одобрим опасния участък",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!areaToDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      await deleteDangerousArea(areaToDelete);
      
      // Update local state
      setAreas(prevAreas => prevAreas.filter(area => area.id !== areaToDelete));
      
      toast({
        title: "Успешно",
        description: "Опасният участък беше изтрит",
      });
      
      // Refresh data to ensure consistency
      await fetchAreas();
      
      if (onRefresh) onRefresh();
      setAreaToDelete(null);
      setDeleteDialogOpen(false);
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

  const confirmDelete = (id: string) => {
    setAreaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const filteredAreas = showPending
    ? areas.filter(area => !area.is_approved)
    : areas;

  const pendingCount = areas.filter(area => !area.is_approved).length;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Грешка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          Опасни участъци
          {pendingCount > 0 && (
            <span className="text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
              {pendingCount} чакащи
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={showPending ? "default" : "outline"}
            onClick={() => setShowPending(true)}
            size="sm"
          >
            Чакащи одобрение
          </Button>
          <Button
            variant={!showPending ? "default" : "outline"}
            onClick={() => setShowPending(false)}
            size="sm"
          >
            Всички
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchAreas}
            disabled={loading}
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Обнови
          </Button>
        </div>
      </div>

      <DangerousAreasList
        areas={filteredAreas}
        isLoading={loading}
        searchQuery=""
        isAdmin={true}
        onApprove={handleApprove}
        onDelete={confirmDelete}
      />
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Потвърдете изтриването</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете този опасен участък? Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Отказ</Button>
            <Button variant="destructive" onClick={handleDelete}>Изтрий</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DangerousAreasManagement;
