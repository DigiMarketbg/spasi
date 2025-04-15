
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
  } = useDangerousAreas(onRefresh);

  useEffect(() => {
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
        onRefresh={fetchAreas}
      />

      <DangerousAreasList
        areas={filteredAreas}
        isLoading={loading}
        searchQuery=""
        isAdmin={true}
        onApprove={handleApprove}
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
