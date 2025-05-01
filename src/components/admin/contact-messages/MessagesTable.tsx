
import React from 'react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import MessageStatusBadge from './MessageStatusBadge';
import MessageActions from './MessageActions';
import { useMessages } from './MessagesContext';
import { ContactMessageData } from '../hooks/useContactMessages';

interface MessagesTableProps {
  messages: ContactMessageData[];
}

const MessagesTable = ({ messages }: MessagesTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy, HH:mm', { locale: bg });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Статус</TableHead>
            <TableHead>От</TableHead>
            <TableHead>Тема</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className={!message.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""}>
              <TableCell>
                <MessageStatusBadge isRead={message.is_read} />
              </TableCell>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell>{message.subject || "Общо запитване"}</TableCell>
              <TableCell>{formatDate(message.created_at)}</TableCell>
              <TableCell className="text-right">
                <MessageActions message={message} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MessagesTable;
