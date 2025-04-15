
import React, { useState, useEffect } from 'react';
import { fetchAllDangerousAreas, updateDangerousAreaApproval } from '@/lib/api/dangerous-areas';
import { DangerousArea } from '@/types/dangerous-area';
import { useToast } from '@/hooks/use-toast';
import DangerousAreasList from '@/components/dangerous-areas/DangerousAreasList';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DangerousAreasManagementProps {
  onRefresh?: () => void;
}

const DangerousAreasManagement: React.FC<DangerousAreasManagementProps> = ({ onRefresh }) => {
  const [areas, setAreas] = useState<DangerousArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(true);
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
      />
    </div>
  );
};

export default DangerousAreasManagement;
