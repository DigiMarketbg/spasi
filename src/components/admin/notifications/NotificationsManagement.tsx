
import React from 'react';
import { Megaphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SendPushNotificationForm from './SendPushNotificationForm';
import SubscribersList from './SubscribersList';

const NotificationsManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Megaphone className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Управление на известия</h2>
      </div>
      
      <Tabs defaultValue="send">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="send">Изпращане</TabsTrigger>
          <TabsTrigger value="subscribers">Абонати</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="mt-4">
          <SendPushNotificationForm />
        </TabsContent>
        
        <TabsContent value="subscribers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Абонати за известия</CardTitle>
              <CardDescription>
                Списък на всички потребители, абонирани за известия
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscribersList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsManagement;
