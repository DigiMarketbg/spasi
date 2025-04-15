
import React, { useState, useEffect } from 'react';
import { fetchAllDangerousAreas, updateDangerousAreaApproval, deleteDangerousArea } from '@/lib/api/dangerous-areas';
import { DangerousArea } from '@/types/dangerous-area';
import { useToast } from '@/hooks/use-toast';
import DangerousAreasList from '@/components/dangerous-areas/DangerousAreasList';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface DangerousAreasManagementProps {
  onRefresh?: () => void;
}

const DangerousAreasManagement: React.FC<DangerousAreasManagementProps> = ({ onRefresh }) => {
  const [areas, setAreas] = useState<DangerousArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const allAreas = await fetchAllDangerousAreas();
      setAreas(allAreas);
    } catch (error) {
      console.error("Error fetching areas:", error);
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
      await updateDangerousAreaApproval(id, true);
      toast({
        title: "Успешно",
        description: "Опасният участък беше одобрен",
      });
      fetchAreas();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error approving area:", error);
      toast({
        title: "Грешка",
        description: "Не успяхме да одобрим опасния участък",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!areaToDelete) return;
    
    try {
      await deleteDangerousArea(areaToDelete);
      toast({
        title: "Успешно",
        description: "Опасният участък беше изтрит",
      });
      fetchAreas();
      if (onRefresh) onRefresh();
      setAreaToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting area:", error);
      toast({
        title: "Грешка",
        description: "Не успяхме да изтрием опасния участък",
        variant: "destructive"
      });
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
            size="sm"
          >
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
