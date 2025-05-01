
import React from 'react';
import MessagesTable from './contact-messages/MessagesTable';
import MessageDetailDialog from './contact-messages/MessageDetailDialog';
import EmptyState from './contact-messages/EmptyState';
import LoadingState from './contact-messages/LoadingState';
import MessageControls from './contact-messages/MessageControls';
import { MessagesProvider } from './contact-messages/MessagesContext';
import { ContactMessageData } from './hooks/useContactMessages';

interface ContactMessagesProps {
  messages: ContactMessageData[];
  loadingMessages: boolean;
  onRefresh: () => void;
}

const ContactMessagesManagement = ({
  messages,
  loadingMessages,
  onRefresh,
}: ContactMessagesProps) => {
  return (
    <MessagesProvider onRefresh={onRefresh}>
      <div>
        <MessageControls messagesCount={messages.length} />

        {loadingMessages ? (
          <LoadingState />
        ) : messages.length === 0 ? (
          <EmptyState />
        ) : (
          <MessagesTable messages={messages} />
        )}
        
        <MessageDetailDialog />
      </div>
    </MessagesProvider>
  );
};

export default ContactMessagesManagement;
