
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import AccessDenied from '@/components/admin/AccessDenied';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardGrid from '@/components/admin/dashboard/AdminDashboardGrid';
import AdminTabs from '@/components/admin/tabs/AdminTabs';
import { useAdminData } from '@/components/admin/hooks/useAdminData';
import { useDangerousAreas } from '@/components/admin/hooks/useDangerousAreas';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  
  // Use our custom hook to fetch admin data
  const {
    signals,
    users,
    partnerRequests,
    contactMessages,
    loadingSignals,
    loadingUsers,
    loadingPartnerRequests,
    loadingContactMessages,
    fetchSignals,
    fetchUsers,
    fetchPartnerRequests,
    fetchContactMessages,
    unreadCount,
    pendingRequestsCount
  } = useAdminData(isAdmin || false, user);
  
  // Use our custom hook to fetch dangerous areas
  const { 
    pendingDangerousAreas,
    loadingDangerousAreas
  } = useDangerousAreas(!!user && !!isAdmin);

  // If not logged in or not admin
  if (!user || !isAdmin) {
    return <AccessDenied />;
  }

  return (
    <AdminLayout title="Административен панел">
      {/* Dashboard Cards */}
      <AdminDashboardGrid 
        unreadMessagesCount={unreadCount} 
        pendingRequestsCount={pendingRequestsCount}
        pendingDangerousAreasCount={pendingDangerousAreas}
      />
      
      {/* Admin Tabs */}
      <AdminTabs 
        signals={signals}
        users={users}
        partnerRequests={partnerRequests}
        contactMessages={contactMessages}
        loadingSignals={loadingSignals}
        loadingUsers={loadingUsers}
        loadingPartnerRequests={loadingPartnerRequests}
        loadingContactMessages={loadingContactMessages}
        loadingDangerousAreas={loadingDangerousAreas}
        unreadCount={unreadCount}
        pendingRequestsCount={pendingRequestsCount}
        pendingDangerousAreasCount={pendingDangerousAreas}
        onRefreshSignals={fetchSignals}
        onRefreshUsers={fetchUsers}
        onRefreshPartnerRequests={fetchPartnerRequests}
        onRefreshContactMessages={fetchContactMessages}
      />
    </AdminLayout>
  );
};

export default Admin;
