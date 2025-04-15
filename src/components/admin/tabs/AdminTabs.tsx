import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import SignalsManagement from '@/components/admin/SignalsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import PartnerRequestsManagement from '@/components/admin/PartnerRequestsManagement';
import ContactMessagesManagement from '@/components/admin/ContactMessagesManagement';
import DangerousAreasManagement from '@/components/admin/DangerousAreasManagement';

interface AdminTabsProps {
  signals: any[];
  users: any[];
  partnerRequests: any[];
  contactMessages: any[];
  loadingSignals: boolean;
  loadingUsers: boolean;
  loadingPartnerRequests: boolean;
  loadingContactMessages: boolean;
  unreadCount: number;
  pendingRequestsCount: number;
  onRefreshSignals: () => void;
  onRefreshUsers: () => void;
  onRefreshPartnerRequests: () => void;
  onRefreshContactMessages: () => void;
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
    <Tabs defaultValue="signals">
      <TabsList className="mb-4">
        <TabsTrigger value="signals">Сигнали</TabsTrigger>
        <TabsTrigger value="users">Потребители</TabsTrigger>
        <TabsTrigger value="partners">
          Партньори
          {pendingRequestsCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="messages">
          Съобщения
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="dangerous-areas">Опасни участъци</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signals" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Управление на сигнали</CardTitle>
            <CardDescription>
              Преглед на всички сигнали в системата, одобрение и отбелязване като решени.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignalsManagement 
              signals={signals} 
              loadingSignals={loadingSignals} 
              onRefresh={onRefreshSignals} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="users" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Управление на потребители</CardTitle>
            <CardDescription>
              Преглед и управление на всички регистрирани потребители.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersManagement 
              users={users} 
              loadingUsers={loadingUsers} 
              onRefresh={onRefreshUsers} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="partners" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Заявки за партньорство</CardTitle>
            <CardDescription>
              Преглед и управление на заявките за партньорство.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PartnerRequestsManagement 
              requests={partnerRequests} 
              loadingRequests={loadingPartnerRequests} 
              onRefresh={onRefreshPartnerRequests} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="messages" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Съобщения от контактната форма</CardTitle>
            <CardDescription>
              Преглед и управление на съобщенията от контактната форма.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactMessagesManagement 
              messages={contactMessages} 
              loadingMessages={loadingContactMessages} 
              onRefresh={onRefreshContactMessages} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="dangerous-areas" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Управление на опасни участъци</CardTitle>
            <CardDescription>
              Преглед и одобрение на подадени опасни участъци.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DangerousAreasManagement onRefresh={onRefreshSignals} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
