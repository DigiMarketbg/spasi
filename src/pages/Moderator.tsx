
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import ModeratorLayout from '@/components/admin/ModeratorLayout';
import ModeratorTabs from '@/components/admin/moderator/ModeratorTabs';
import { useModeratorData } from '@/components/admin/moderator/useModeratorData';

const Moderator = () => {
  const { user, profile } = useAuth();
  
  // Check if the user is a moderator or admin
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin';
  const isAuthenticated = !!user;
  
  // Use the custom hook to fetch and manage data
  const {
    signals,
    loadingSignals,
    loadingDangerousAreas,
    error,
    handleRefresh,
    refetchSignals,
    refetchDangerousAreas
  } = useModeratorData(isAuthenticated && isModerator);

  return (
    <ModeratorLayout
      error={error}
      onRefresh={handleRefresh}
      isAuthenticated={isAuthenticated}
      isModerator={isModerator}
    >
      <ModeratorTabs
        signals={signals}
        loadingSignals={loadingSignals}
        loadingDangerousAreas={loadingDangerousAreas}
        refetchSignals={refetchSignals}
        refetchDangerousAreas={refetchDangerousAreas}
      />
    </ModeratorLayout>
  );
};

export default Moderator;
