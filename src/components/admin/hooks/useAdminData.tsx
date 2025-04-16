
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { useSignalsData } from './useSignalsData';
import { useUsersData } from './useUsersData';
import { usePartnerRequests } from './usePartnerRequests';
import { useContactMessages } from './useContactMessages';

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

  // Initial data fetching
  useEffect(() => {
    if (isEnabled && user) {
      fetchSignals();
      fetchUsers();
      fetchPartnerRequests();
      fetchContactMessages();
    }
  }, [isEnabled, user, fetchSignals, fetchUsers, fetchPartnerRequests, fetchContactMessages]);

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
    unreadCount
  };
};
