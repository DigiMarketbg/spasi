
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import AdminTabsList from './components/AdminTabsList';
import SignalsTabContent from './tab-contents/SignalsTabContent';
import UsersTabContent from './tab-contents/UsersTabContent';
import PartnersTabContent from './tab-contents/PartnersTabContent';
import MessagesTabContent from './tab-contents/MessagesTabContent';
import DangerousAreasTabContent from './tab-contents/DangerousAreasTabContent';
import NotificationsTabContent from './tab-contents/NotificationsTabContent';
import GoodDeedsTabContent from './tab-contents/GoodDeedsTabContent';
import PetsTabContent from './components/PetsTabContent';

// Add new tab in the AdminTabs component and show badge with pending count

const AdminTabs = ({
  signals,
  users,
  partnerRequests,
  contactMessages,
  loadingSignals,
  loadingUsers,
  loadingPartnerRequests,
  loadingContactMessages,
  loadingDangerousAreas,
  unreadCount,
  pendingRequestsCount,
  pendingDangerousAreasCount,
  pendingGoodDeedsCount = 0,
  onRefreshSignals,
  onRefreshUsers,
  onRefreshPartnerRequests,
  onRefreshContactMessages,
}: any) => {
  return (
    <Tabs defaultValue="signals">
      <AdminTabsList
        unreadCount={unreadCount}
        pendingRequestsCount={pendingRequestsCount}
        pendingDangerousAreasCount={pendingDangerousAreasCount}
        pendingGoodDeedsCount={pendingGoodDeedsCount}
      />
      
      <TabsContent value="signals" className="mt-6">
        <SignalsTabContent 
          signals={signals} 
          loadingSignals={loadingSignals} 
          onRefresh={onRefreshSignals} 
        />
      </TabsContent>
      
      <TabsContent value="users" className="mt-6">
        <UsersTabContent 
          users={users} 
          loadingUsers={loadingUsers} 
          onRefresh={onRefreshUsers} 
        />
      </TabsContent>
      
      <TabsContent value="partners" className="mt-6">
        <PartnersTabContent 
          requests={partnerRequests} 
          loadingRequests={loadingPartnerRequests} 
          onRefresh={onRefreshPartnerRequests}
          pendingRequestsCount={pendingRequestsCount}
        />
      </TabsContent>
      
      <TabsContent value="messages" className="mt-6">
        <MessagesTabContent 
          messages={contactMessages} 
          loadingMessages={loadingContactMessages} 
          onRefresh={onRefreshContactMessages}
          unreadCount={unreadCount}
        />
      </TabsContent>
      
      <TabsContent value="dangerous-areas" className="mt-6">
        <DangerousAreasTabContent 
          onRefresh={onRefreshSignals} 
          loading={loadingDangerousAreas}
          pendingCount={pendingDangerousAreasCount}
        />
      </TabsContent>

      <TabsContent value="good-deeds" className="mt-6">
        <GoodDeedsTabContent />
      </TabsContent>

      <TabsContent value="pets" className="mt-6">
        <PetsTabContent />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <NotificationsTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
