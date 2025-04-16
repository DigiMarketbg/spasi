
import { useEffect } from 'react';
import { useSignals } from './useSignals';
import { useUsers } from './useUsers';
import { usePartnerRequests } from './usePartnerRequests';
import { useContactMessages } from './useContactMessages';
import { SignalData, UserData, PartnerRequestData, ContactMessageData } from './types';

export type { SignalData, UserData, PartnerRequestData, ContactMessageData };

export const useAdminData = (isAdmin: boolean, user: any) => {
  // Use the individual hooks
  const { signals, loadingSignals, fetchSignals } = useSignals(isAdmin, user);
  const { users, loadingUsers, fetchUsers } = useUsers(isAdmin, user);
  const { 
    partnerRequests, 
    loadingPartnerRequests, 
    fetchPartnerRequests, 
    pendingRequestsCount 
  } = usePartnerRequests(isAdmin, user);
  const { 
    contactMessages, 
    loadingContactMessages, 
    fetchContactMessages, 
    unreadCount 
  } = useContactMessages(isAdmin, user);

  // Load data when component mounts or admin status changes
  useEffect(() => {
    if (user && isAdmin) {
      fetchSignals();
      fetchUsers();
      fetchPartnerRequests();
      fetchContactMessages();
    }
  }, [user, isAdmin, fetchSignals, fetchUsers, fetchPartnerRequests, fetchContactMessages]);

  return {
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
  };
};
