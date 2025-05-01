
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
import { Check, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PartnerRequestsProps {
  requests?: any[];
  loadingRequests: boolean;
  onRefresh: () => void;
}

const PartnerRequestsManagement = ({
  requests = [],
  loadingRequests,
  onRefresh,
}: PartnerRequestsProps) => {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy, HH:mm', { locale: bg });
    } catch {
      return dateString;
    }
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      
      // First, get the partner request data
      const { data: requestData, error: fetchError } = await supabase
        .from('partners_requests')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Then create a new partner entry
      const { error: insertError } = await supabase
        .from('partners')
        .insert({
          company_name: requestData.company_name,
          logo_url: requestData.logo_url || 'https://via.placeholder.com/150',
          website_url: null
        });
        
      if (insertError) throw insertError;
      
      // Finally update the request as approved
      const { error: updateError } = await supabase
        .from('partners_requests')
        .update({ is_approved: true })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      toast({
        title: 'Успешно',
        description: 'Партньорът беше одобрен успешно.',
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error approving partner:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при одобрението на партньора.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      
      const { error } = await supabase
        .from('partners_requests')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Заявката беше отхвърлена успешно.',
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error rejecting partner request:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при отхвърлянето на заявката.',
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

      {loadingRequests ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center p-8 bg-muted/10 rounded-lg">
          <p className="text-muted-foreground">Няма заявки за партньорство</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Компания</TableHead>
                <TableHead>Контактно лице</TableHead>
                <TableHead>Имейл</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.company_name}</TableCell>
                  <TableCell>{request.contact_person}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
                  <TableCell>
                    {request.is_approved ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Одобрен
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        Очаква
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        Детайли
                      </Button>
                      
                      {!request.is_approved && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleApprove(request.id)}
                            disabled={processingId === request.id}
                          >
                            {processingId === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleReject(request.id)}
                            disabled={processingId === request.id}
                          >
                            {processingId === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
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
            <DialogTitle>Детайли за заявката</DialogTitle>
            <DialogDescription>
              Информация за заявката за партньорство
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Компания:</div>
                <div>{selectedRequest.company_name}</div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Контактно лице:</div>
                <div>{selectedRequest.contact_person}</div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Имейл:</div>
                <div>{selectedRequest.email}</div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Телефон:</div>
                <div>{selectedRequest.phone || 'Не е предоставен'}</div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Съобщение:</div>
                <div className="whitespace-pre-wrap p-3 bg-muted rounded-md max-h-40 overflow-y-auto">
                  {selectedRequest.message || 'Няма съобщение'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Дата:</div>
                <div>{formatDate(selectedRequest.created_at)}</div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="font-medium">Лого URL:</div>
                <div className="break-all">{selectedRequest.logo_url || 'Не е предоставен'}</div>
              </div>
              
              {!selectedRequest.is_approved && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setIsDetailOpen(false);
                    }}
                  >
                    Одобри
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setIsDetailOpen(false);
                    }}
                  >
                    Отхвърли
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerRequestsManagement;
