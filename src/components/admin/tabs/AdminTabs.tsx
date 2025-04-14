
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignalsManagement from '../SignalsManagement';
import UsersManagement from '../UsersManagement';
import PartnerRequestsManagement from '../PartnerRequestsManagement';
import ContactMessagesManagement from '../ContactMessagesManagement';
import NotificationsManagement from '../notifications/NotificationsManagement';
import { SignalData, UserData, PartnerRequestData, ContactMessageData } from '../hooks/useAdminData';

interface AdminTabsProps {
  signals: SignalData[];
  users: UserData[];
  partnerRequests: PartnerRequestData[];
  contactMessages: ContactMessageData[];
  loadingSignals: boolean;
  loadingUsers: boolean;
  loadingPartnerRequests: boolean;
  loadingContactMessages: boolean;
  unreadCount: number;
  pendingRequestsCount: number;
  onRefreshSignals: () => Promise<void>;
  onRefreshUsers: () => Promise<void>;
  onRefreshPartnerRequests: () => Promise<void>;
  onRefreshContactMessages: () => Promise<void>;
}

const AdminTabs = ({
  signals,
  users,
  partnerRequests,
  contactMessages,
  loadingSignals,
  loadingUsers,
  loadingPartnerRequests,
  loadingContactMessages,
  unreadCount,
  pendingRequestsCount,
  onRefreshSignals,
  onRefreshUsers,
  onRefreshPartnerRequests,
  onRefreshContactMessages
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="signals" className="mt-8">
      <TabsList className="grid w-full max-w-4xl grid-cols-5 mb-8">
        <TabsTrigger value="signals">Сигнали</TabsTrigger>
        <TabsTrigger value="users">Потребители</TabsTrigger>
        <TabsTrigger value="partners">
          Партньори
          {pendingRequestsCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {pendingRequestsCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="messages">
          Съобщения
          {unreadCount > 0 && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="notifications">
          Известия
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signals">
        <SignalsManagement 
          signals={signals} 
          loadingSignals={loadingSignals}
          onRefresh={onRefreshSignals}
        />
      </TabsContent>
      
      <TabsContent value="users">
        <UsersManagement 
          users={users} 
          loadingUsers={loadingUsers}
          onRefresh={onRefreshUsers}
        />
      </TabsContent>
      
      <TabsContent value="partners">
        <PartnerRequestsManagement 
          requests={partnerRequests} 
          loadingRequests={loadingPartnerRequests}
          onRefresh={onRefreshPartnerRequests}
        />
      </TabsContent>
      
      <TabsContent value="messages">
        <ContactMessagesManagement 
          messages={contactMessages} 
          loadingMessages={loadingContactMessages}
          onRefresh={onRefreshContactMessages}
        />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsManagement />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
