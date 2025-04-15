
import React, { useState, useEffect } from 'react';
import { useDangerousAreas } from './useDangerousAreas';
import AreaFilters from './AreaFilters';
import ErrorDisplay from './ErrorDisplay';
import DeleteAreaDialog from './DeleteAreaDialog';
import DangerousAreasList from '@/components/dangerous-areas/DangerousAreasList';
import { DangerousArea } from '@/types/dangerous-area';
import { toast } from 'sonner';
import { updateDangerousAreaApproval, deleteDangerousArea, fetchAllDangerousAreas } from '@/lib/api/dangerous-areas';

interface DangerousAreasManagementProps {
  areas?: DangerousArea[];
  loading?: boolean;
  onRefresh?: () => void;
}

const DangerousAreasManagement: React.FC<DangerousAreasManagementProps> = ({ 
  areas: externalAreas, 
  loading: externalLoading,
  onRefresh: externalRefresh 
}) => {
  const [showPending, setShowPending] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [areasData, setAreasData] = useState<DangerousArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the hook if no external data is provided
  const {
    areas: hookAreas,
    loading: hookLoading,
    error,
    processingApproval: hookProcessingId,
    fetchAreas: hookFetchAreas,
    handleApprove: hookHandleApprove,
    handleDelete: hookHandleDelete,
    setError
  } = useDangerousAreas(() => {
    console.log("External refresh callback triggered from useDangerousAreas");
    if (externalRefresh) externalRefresh();
    fetchAllAreas();
  });

  // Get all areas independently to ensure we always have the latest data
  const fetchAllAreas = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllDangerousAreas();
      console.log("Fetched areas in DangerousAreasManagement:", data);
      setAreasData(data || []);
    } catch (err) {
      console.error("Error fetching areas:", err);
      toast.error("Грешка при зареждане на опасните участъци");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllAreas();
  }, []);

  // Choose between external and hook data
  const areas = areasData.length > 0 ? areasData : (externalAreas || hookAreas);
  const loading = isLoading || (externalLoading !== undefined ? externalLoading : hookLoading);
  const processingApproval = hookProcessingId || processingId;

  const fetchAreas = () => {
    fetchAllAreas();
    if (externalRefresh) {
      externalRefresh();
    } else {
      hookFetchAreas();
    }
  };

  const confirmDelete = (id: string) => {
    setAreaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return;
    
    try {
      setProcessingId(areaToDelete);
      
      await deleteDangerousArea(areaToDelete);
      toast.success("Опасният участък е изтрит успешно");
      fetchAreas();
    } catch (error) {
      console.error("Error deleting area:", error);
      toast.error("Грешка при изтриване на опасния участък");
    } finally {
      setProcessingId(null);
      setAreaToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const filteredAreas = showPending
    ? areas.filter(area => !area.is_approved)
    : areas;

  const pendingCount = areas.filter(area => !area.is_approved).length;

  const handleApproveArea = async (id: string): Promise<void> => {
    try {
      setError(null); // Clear any previous errors
      setProcessingId(id);
      console.log(`Approving area with ID: ${id}`);
      
      await updateDangerousAreaApproval(id, true);
      toast.success("Опасният участък е одобрен успешно");
      fetchAreas();
    } catch (error) {
      console.error("Error in handleApproveArea:", error);
      toast.error("Грешка при одобряване на опасния участък");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} />
      
      <AreaFilters
        showPending={showPending}
        setShowPending={setShowPending}
        pendingCount={pendingCount}
        loading={loading}
        onRefresh={() => {
          console.log("Manual refresh triggered from UI");
          fetchAreas();
        }}
      />

      {console.log("Rendering areas list with:", filteredAreas)}
      <DangerousAreasList
        areas={filteredAreas}
        isLoading={loading}
        searchQuery=""
        isAdmin={true}
        onApprove={handleApproveArea}
        onDelete={confirmDelete}
        processingApproval={processingApproval}
      />
      
      <DeleteAreaDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default DangerousAreasManagement;
