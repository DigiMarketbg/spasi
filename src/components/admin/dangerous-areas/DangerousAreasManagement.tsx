
import React, { useEffect, useState } from 'react';
import { useDangerousAreas } from './useDangerousAreas';
import AreaFilters from './AreaFilters';
import ErrorDisplay from './ErrorDisplay';
import DeleteAreaDialog from './DeleteAreaDialog';
import DangerousAreasList from '@/components/dangerous-areas/DangerousAreasList';

interface DangerousAreasManagementProps {
  onRefresh?: () => void;
}

const DangerousAreasManagement: React.FC<DangerousAreasManagementProps> = ({ onRefresh }) => {
  const [showPending, setShowPending] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
  
  const {
    areas,
    loading,
    error,
    processingApproval,
    fetchAreas,
    handleApprove,
    handleDelete,
    setError
  } = useDangerousAreas(() => {
    console.log("External refresh callback triggered from useDangerousAreas");
    if (onRefresh) onRefresh();
  });

  useEffect(() => {
    console.log("DangerousAreasManagement - Initial load or dependency changed, fetching areas");
    fetchAreas();
  }, [fetchAreas]);

  const confirmDelete = (id: string) => {
    setAreaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return;
    await handleDelete(areaToDelete);
    setAreaToDelete(null);
    setDeleteDialogOpen(false);
  };

  const filteredAreas = showPending
    ? areas.filter(area => !area.is_approved)
    : areas;

  const pendingCount = areas.filter(area => !area.is_approved).length;

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
        onApprove={(id) => {
          console.log(`Approve button clicked for ID: ${id}`);
          handleApprove(id);
        }}
        onDelete={confirmDelete}
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
