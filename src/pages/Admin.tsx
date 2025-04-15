
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboardGrid from '@/components/admin/dashboard/AdminDashboardGrid';
import AdminTabs from '@/components/admin/tabs/AdminTabs';
import { Button } from '@/components/ui/button';
import { useAdminData } from '@/components/admin/hooks/useAdminData';
import { fetchAllDangerousAreas } from '@/lib/api/dangerous-areas';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pendingDangerousAreas, setPendingDangerousAreas] = useState(0);

  // Use the custom hook to manage all admin data
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
  } = useAdminData(isAdmin, user);

  // Fetch pending dangerous areas count
  useEffect(() => {
    if (user && isAdmin) {
      const getPendingDangerousAreas = async () => {
        try {
          const areas = await fetchAllDangerousAreas();
          const pendingCount = areas.filter(area => !area.is_approved).length;
          setPendingDangerousAreas(pendingCount);
        } catch (error) {
          console.error("Error fetching dangerous areas:", error);
        }
      };
      
      getPendingDangerousAreas();
    }
  }, [user, isAdmin]);

  // If not logged in or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Достъпът отказан</h1>
            <p className="mb-6">Трябва да сте администратор, за да видите тази страница.</p>
            <Button onClick={() => navigate('/')}>Към началната страница</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Административен панел</h1>
          
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
            unreadCount={unreadCount}
            pendingRequestsCount={pendingRequestsCount}
            onRefreshSignals={fetchSignals}
            onRefreshUsers={fetchUsers}
            onRefreshPartnerRequests={fetchPartnerRequests}
            onRefreshContactMessages={fetchContactMessages}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
