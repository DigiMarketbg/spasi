
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check, Trash2, Loader2 } from 'lucide-react';

interface MessageActionsProps {
  message: any;
  onView: (message: any) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  processingId: string | null;
}

const MessageActions = ({ 
  message, 
  onView, 
  onMarkAsRead, 
  onDelete, 
  processingId 
}: MessageActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onView(message)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {!message.is_read && (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600"
          onClick={() => onMarkAsRead(message.id)}
          disabled={processingId === message.id}
        >
          {processingId === message.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        className="text-red-600"
        onClick={() => onDelete(message.id)}
        disabled={processingId === message.id}
      >
        {processingId === message.id ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default MessageActions;
