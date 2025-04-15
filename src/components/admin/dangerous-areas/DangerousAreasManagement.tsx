
import React, { useState } from 'react';
import { useDangerousAreas } from './useDangerousAreas';
import AreaFilters from './AreaFilters';
import ErrorDisplay from './ErrorDisplay';
import DeleteAreaDialog from './DeleteAreaDialog';
import DangerousAreasList from '@/components/dangerous-areas/DangerousAreasList';
import { DangerousArea } from '@/types/dangerous-area';
import { toast } from 'sonner';
import { updateDangerousAreaApproval, deleteDangerousArea } from '@/lib/api/dangerous-areas';

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
  });

  // Choose between external and hook data
  const areas = externalAreas || hookAreas;
  const loading = externalLoading !== undefined ? externalLoading : hookLoading;
  const processingApproval = hookProcessingId || processingId;

  const fetchAreas = () => {
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
      
      if (externalRefresh) {
        // Use direct API call with external refresh
        await deleteDangerousArea(areaToDelete);
        toast.success("Опасният участък е изтрит успешно");
        externalRefresh();
      } else {
        // Use hook function
        await hookHandleDelete(areaToDelete);
      }
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
      
      if (externalRefresh) {
        // Use direct API call with external refresh
        await updateDangerousAreaApproval(id, true);
        toast.success("Опасният участък е одобрен успешно");
        externalRefresh();
      } else {
        // Use hook function
        await hookHandleApprove(id);
      }
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
