
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MessageStatusBadgeProps {
  isRead: boolean;
}

const MessageStatusBadge = ({ isRead }: MessageStatusBadgeProps) => {
  if (isRead) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        Прочетено
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-blue-100 text-blue-800">
      Ново
    </Badge>
  );
};

export default MessageStatusBadge;
