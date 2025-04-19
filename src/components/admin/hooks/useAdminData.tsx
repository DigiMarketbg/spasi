import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { useSignalsData } from './useSignalsData';
import { useUsersData } from './useUsersData';
import { usePartnerRequests } from './usePartnerRequests';
import { useContactMessages } from './useContactMessages';
import { getGoodDeedsStats } from '@/lib/api/good-deeds';

export const useAdminData = (isEnabled: boolean, user: User | null) => {
  // Use our individual hooks for data fetching
  const { 
    signals, 
    loadingSignals, 
    fetchSignals 
  } = useSignalsData(isEnabled);
  
  const { 
    users, 
    loadingUsers, 
    fetchUsers 
  } = useUsersData(isEnabled);
  
  const { 
    partnerRequests, 
    loadingPartnerRequests, 
    fetchPartnerRequests,
    pendingRequestsCount
  } = usePartnerRequests(isEnabled);
  
  const { 
    contactMessages, 
    loadingContactMessages, 
    fetchContactMessages,
    unreadCount
  } = useContactMessages(isEnabled);

  const [pendingGoodDeedsCount, setPendingGoodDeedsCount] = useState(0);

  const fetchGoodDeedsStats = useCallback(async () => {
    try {
      const stats = await getGoodDeedsStats();
      setPendingGoodDeedsCount(stats.pending_count);
    } catch (error) {
      console.error('Failed to fetch good deeds stats', error);
    }
  }, []);

  // Initial data fetching
  useEffect(() => {
    if (isEnabled && user) {
      fetchSignals();
      fetchUsers();
      fetchPartnerRequests();
      fetchContactMessages();
      fetchGoodDeedsStats();
    }
  }, [isEnabled, user, fetchSignals, fetchUsers, fetchPartnerRequests, fetchContactMessages, fetchGoodDeedsStats]);

  // Return combined data and functions from all hooks
  return {
    // Signals data
    signals,
    loadingSignals,
    fetchSignals,
    
    // Users data
    users,
    loadingUsers,
    fetchUsers,
    
    // Partner requests data
    partnerRequests,
    loadingPartnerRequests,
    fetchPartnerRequests,
    pendingRequestsCount,
    
    // Contact messages data
    contactMessages,
    loadingContactMessages,
    fetchContactMessages,
    unreadCount,

    // Good deeds pending count
    pendingGoodDeedsCount,
  };
};
