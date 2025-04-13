
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Eye, Loader2, Mail, Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactMessagesProps {
  messages: any[];
  loadingMessages: boolean;
  onRefresh: () => void;
}

const ContactMessagesManagement = ({
  messages,
  loadingMessages,
  onRefresh,
}: ContactMessagesProps) => {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy, HH:mm', { locale: bg });
    } catch {
      return dateString;
    }
  };

  const handleViewDetails = async (message: any) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
    
    // Mark as read if not already read
    if (!message.is_read) {
      try {
        await supabase
          .from('contact_messages')
          .update({ is_read: true })
          .eq('id', message.id);
          
        onRefresh();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setProcessingId(id);
      
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Съобщението беше маркирано като прочетено.',
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при маркирането на съобщението.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setProcessingId(id);
      
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Съобщението беше изтрито успешно.',
      });
      
      onRefresh();
      
      if (isDetailOpen && selectedMessage?.id === id) {
        setIsDetailOpen(false);
      }
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при изтриването на съобщението.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={onRefresh} variant="outline" size="sm">
          Обнови
        </Button>
      </div>

      {loadingMessages ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center p-8 bg-muted/10 rounded-lg">
          <p className="text-muted-foreground">Няма получени съобщения</p>
        </div>
      ) : (
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
                    {message.is_read ? (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Прочетено
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Ново
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.subject || "Общо запитване"}</TableCell>
                  <TableCell>{formatDate(message.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {!message.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600"
                          onClick={() => handleMarkAsRead(message.id)}
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
                        onClick={() => handleDelete(message.id)}
                        disabled={processingId === message.id}
                      >
                        {processingId === message.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Детайли за съобщението</DialogTitle>
            <DialogDescription>
              Съобщение от {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4 mt-2">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-lg">
                  {selectedMessage.subject || "Общо запитване"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(selectedMessage.created_at)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">От:</div>
                  <div>{selectedMessage.name}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Имейл:</div>
                  <div className="break-all">{selectedMessage.email}</div>
                </div>
              </div>
              
              {selectedMessage.phone && (
                <div>
                  <div className="text-sm text-muted-foreground">Телефон:</div>
                  <div>{selectedMessage.phone}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-muted-foreground">Съобщение:</div>
                <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                {!selectedMessage.is_read && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);
                    }}
                  >
                    Маркирай като прочетено
                  </Button>
                )}
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedMessage.id);
                    setIsDetailOpen(false);
                  }}
                >
                  Изтрий
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactMessagesManagement;
