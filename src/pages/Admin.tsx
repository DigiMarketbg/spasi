
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboardGrid from '@/components/admin/dashboard/AdminDashboardGrid';
import AdminTabs from '@/components/admin/tabs/AdminTabs';
import { Button } from '@/components/ui/button';
import { fetchAllDangerousAreas } from '@/lib/api/dangerous-areas';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pendingDangerousAreas, setPendingDangerousAreas] = useState(0);
  const [loadingDangerousAreas, setLoadingDangerousAreas] = useState(true);
  
  // State for admin data
  const [signals, setSignals] = useState([]);
  const [users, setUsers] = useState([]);
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPartnerRequests, setLoadingPartnerRequests] = useState(true);
  const [loadingContactMessages, setLoadingContactMessages] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Fetch signals
  const fetchSignals = async () => {
    if (!user || !isAdmin) return;
    
    setLoadingSignals(true);
    try {
      // Fetch signals without joining profiles
      const { data: signalsData, error } = await supabase
        .from('signals')
        .select('*');

      if (error) throw error;
      
      // For each signal, fetch the user profile separately
      const processedSignals = await Promise.all(signalsData.map(async (signal) => {
        // Explicitly fetch the profile for each signal's user_id
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', signal.user_id)
          .single();
          
        return {
          ...signal,
          // Use default values if profile data is null or undefined
          user_full_name: profileData?.full_name || 'Неизвестен',
          user_email: profileData?.email || 'Неизвестен имейл'
        };
      }));
      
      setSignals(processedSignals);
    } catch (error) {
      console.error('Error fetching signals:', error);
      toast.error('Грешка при зареждане на сигналите');
    } finally {
      setLoadingSignals(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    if (!user || !isAdmin) return;
    
    setLoadingUsers(true);
    try {
      // Fetch all profiles without filtering
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at, is_admin, role')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched users data:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Грешка при зареждане на потребителите');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch partner requests
  const fetchPartnerRequests = async () => {
    if (!user || !isAdmin) return;
    
    setLoadingPartnerRequests(true);
    try {
      const { data, error } = await supabase
        .from('partners_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartnerRequests(data || []);
      
      // Count pending requests
      const pendingCount = (data || []).filter(req => !req.is_approved).length;
      setPendingRequestsCount(pendingCount);
    } catch (error) {
      console.error('Error fetching partner requests:', error);
      toast.error('Грешка при зареждане на партньорските заявки');
    } finally {
      setLoadingPartnerRequests(false);
    }
  };

  // Fetch contact messages
  const fetchContactMessages = async () => {
    if (!user || !isAdmin) return;
    
    setLoadingContactMessages(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactMessages(data || []);
      
      // Count unread messages
      const unreadMessagesCount = (data || []).filter(msg => !msg.is_read).length;
      setUnreadCount(unreadMessagesCount);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast.error('Грешка при зареждане на съобщенията');
    } finally {
      setLoadingContactMessages(false);
    }
  };

  // Fetch pending dangerous areas count
  useEffect(() => {
    if (user && isAdmin) {
      const getPendingDangerousAreas = async () => {
        try {
          setLoadingDangerousAreas(true);
          const areas = await fetchAllDangerousAreas();
          console.log("Fetched dangerous areas in Admin:", areas);
          const pendingCount = areas.filter(area => !area.is_approved).length;
          setPendingDangerousAreas(pendingCount);
        } catch (error) {
          console.error("Error fetching dangerous areas:", error);
          toast.error("Грешка при зареждане на опасните участъци");
        } finally {
          setLoadingDangerousAreas(false);
        }
      };
      
      getPendingDangerousAreas();
    }
  }, [user, isAdmin]);

  // Load admin data when component mounts
  useEffect(() => {
    if (user && isAdmin) {
      fetchSignals();
      fetchUsers();
      fetchPartnerRequests();
      fetchContactMessages();
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
            loadingDangerousAreas={loadingDangerousAreas}
            unreadCount={unreadCount}
            pendingRequestsCount={pendingRequestsCount}
            pendingDangerousAreasCount={pendingDangerousAreas}
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
