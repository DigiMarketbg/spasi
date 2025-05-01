
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import AdminTabsList from './components/AdminTabsList';
import SignalsTabContent from './tab-contents/SignalsTabContent';
import UsersTabContent from './tab-contents/UsersTabContent';
import PartnersTabContent from './tab-contents/PartnersTabContent';
import DangerousAreasTabContent from './tab-contents/DangerousAreasTabContent';
import MessagesTabContent from './tab-contents/MessagesTabContent';
import NotificationsTabContent from './tab-contents/NotificationsTabContent';
import PetsTabContent from './components/PetsTabContent';
import GoodDeedsTabContent from './tab-contents/GoodDeedsTabContent';
import WitnessesTabContent from './components/WitnessesTabContent';

interface AdminTabsProps {
  signals?: any[];
  loadingSignals?: boolean;
  users?: any[];
  loadingUsers?: boolean;
  partnerRequests?: any[];
  loadingPartnerRequests?: boolean;
  contactMessages?: any[];
  loadingMessages?: boolean;
  pendingGoodDeedsCount?: number;
  witnesses?: any[];
  loadingWitnesses?: boolean;
  refresh?: {
    signals: () => Promise<void>;
    users: () => Promise<void>;
    partnerRequests: () => Promise<void>;
    contactMessages: () => Promise<void>;
    dangerousAreas: () => Promise<void>;
    witnesses: () => Promise<void>;
  };
  pendingRequestsCount?: number;
  unreadMessagesCount?: number;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  signals = [],
  loadingSignals = false,
  users = [],
  loadingUsers = false,
  partnerRequests = [],
  loadingPartnerRequests = false,
  contactMessages = [],
  loadingMessages = false,
  witnesses = [],
  loadingWitnesses = false,
  refresh,
  pendingRequestsCount = 0,
  unreadMessagesCount = 0,
  pendingGoodDeedsCount = 0,
}) => {
  return (
    <Tabs defaultValue="signals" className="w-full">
      <AdminTabsList 
        pendingRequestsCount={pendingRequestsCount}
        unreadMessagesCount={unreadMessagesCount}
        pendingGoodDeedsCount={pendingGoodDeedsCount}
      />
      
      <div className="mt-6">
        {/* Signals Tab */}
        <SignalsTabContent 
          signals={signals} 
          loadingSignals={loadingSignals}
          onRefresh={refresh?.signals}
        />
        
        {/* Users Tab */}
        <UsersTabContent 
          users={users} 
          loadingUsers={loadingUsers}
          onRefresh={refresh?.users}
        />
        
        {/* Partners Tab */}
        <PartnersTabContent 
          partnerRequests={partnerRequests}
          loadingPartnerRequests={loadingPartnerRequests}
          onRefresh={refresh?.partnerRequests}
        />
        
        {/* Messages Tab */}
        <MessagesTabContent 
          contactMessages={contactMessages}
          loadingMessages={loadingMessages}
          onRefresh={refresh?.contactMessages}
        />
        
        {/* Dangerous Areas Tab */}
        <DangerousAreasTabContent 
          onRefresh={refresh?.dangerousAreas}
        />
        
        {/* Good Deeds Tab */}
        <GoodDeedsTabContent />
        
        {/* Pets Tab */}
        <PetsTabContent 
          onRefresh={refresh?.signals}
        />
        
        {/* Witnesses Tab */}
        <WitnessesTabContent 
          value="witnesses"
          onRefresh={refresh?.witnesses}
        />
        
        {/* Notifications Tab */}
        <NotificationsTabContent 
          value="notifications"
        />
      </div>
    </Tabs>
  );
};

export default AdminTabs;
