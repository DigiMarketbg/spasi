
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ContactMessagesManagement from '@/components/admin/ContactMessagesManagement';

interface MessagesTabContentProps {
  messages?: any[];
  loadingMessages: boolean;
  onRefresh: () => void;
  unreadCount?: number;
}

const MessagesTabContent = ({ 
  messages = [], // Provide default value
  loadingMessages, 
  onRefresh,
  unreadCount = 0
}: MessagesTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Съобщения от контактната форма</CardTitle>
        <CardDescription>
          Преглед и управление на съобщенията от контактната форма.
          {unreadCount > 0 && (
            <span className="ml-2 text-blue-600 font-medium">
              ({unreadCount} непрочетени)
            </span>
          )}
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
