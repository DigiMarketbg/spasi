
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ContactMessagesManagement from '@/components/admin/ContactMessagesManagement';
import { TabsContent } from '@/components/ui/tabs';

interface MessagesTabContentProps {
  messages: any[];
  loadingMessages: boolean;
  onRefresh?: () => void;
  unreadCount: number;
}

const MessagesTabContent = ({ 
  messages, 
  loadingMessages, 
  onRefresh,
  unreadCount
}: MessagesTabContentProps) => {
  return (
    <TabsContent value="messages" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Съобщения от контактната форма</CardTitle>
          <CardDescription>
            Преглед и управление на съобщенията от контактната форма.
            {unreadCount > 0 && (
              <span className="text-amber-600 font-medium ml-2">
                ({unreadCount} непрочетени)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactMessagesManagement 
            messages={messages} 
            loadingMessages={loadingMessages} 
            onRefresh={onRefresh || (() => {})} 
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MessagesTabContent;
