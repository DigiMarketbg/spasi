
import React, { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useAdminData } from '@/components/admin/hooks/useAdminData';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTabs from '@/components/admin/tabs/AdminTabs';
import AdminDashboardGrid from '@/components/admin/dashboard/AdminDashboardGrid';

const Admin = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin === true;
  const isAuthenticated = !!user;
  
  const {
    signals,
    loadingSignals,
    fetchSignals,
    users,
    loadingUsers,
    fetchUsers,
    partnerRequests,
    loadingPartnerRequests,
    fetchPartnerRequests,
    pendingRequestsCount,
    contactMessages,
    loadingContactMessages,
    fetchContactMessages,
    unreadCount,
    pendingGoodDeedsCount,
    witnesses,
    loadingWitnesses,
    fetchWitnesses,
  } = useAdminData(isAuthenticated && isAdmin, user);
  
  const refreshFunctions = {
    signals: fetchSignals,
    users: fetchUsers,
    partnerRequests: fetchPartnerRequests,
    contactMessages: fetchContactMessages,
    dangerousAreas: async () => {}, // We don't have a dedicated fetch function for dangerous areas
    witnesses: fetchWitnesses,
  };
  
  return (
    <AdminLayout
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Администраторски панел</h1>
        
        <AdminDashboardGrid 
          unreadMessagesCount={unreadCount}
          pendingRequestsCount={pendingRequestsCount}
          pendingDangerousAreasCount={0} // We don't have this data yet
        />
        
        <AdminTabs 
          signals={signals}
          loadingSignals={loadingSignals}
          users={users}
          loadingUsers={loadingUsers}
          partnerRequests={partnerRequests}
          loadingPartnerRequests={loadingPartnerRequests}
          contactMessages={contactMessages}
          loadingMessages={loadingContactMessages}
          refresh={refreshFunctions}
          pendingRequestsCount={pendingRequestsCount}
          unreadMessagesCount={unreadCount}
          pendingGoodDeedsCount={pendingGoodDeedsCount}
          witnesses={witnesses}
          loadingWitnesses={loadingWitnesses}
        />
      </div>
    </AdminLayout>
  );
};

export default Admin;
