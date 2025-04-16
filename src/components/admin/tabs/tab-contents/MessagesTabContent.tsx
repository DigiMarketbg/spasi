
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ContactMessagesManagement from '@/components/admin/ContactMessagesManagement';

interface MessagesTabContentProps {
  messages: any[];
  loadingMessages: boolean;
  onRefresh: () => void;
  unreadCount: number;
}

const MessagesTabContent = ({ 
  messages, 
  loadingMessages, 
  onRefresh,
  unreadCount
}: MessagesTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Съобщения от контактната форма</CardTitle>
        <CardDescription>
          Преглед и управление на съобщенията от контактната форма.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContactMessagesManagement 
          messages={messages} 
          loadingMessages={loadingMessages} 
          onRefresh={onRefresh} 
        />
      </CardContent>
    </Card>
  );
};

export default MessagesTabContent;
