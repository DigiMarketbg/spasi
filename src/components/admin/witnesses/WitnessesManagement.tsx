import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { fetchAllWitnesses, updateWitnessStatus, deleteWitness } from '@/lib/api/witnesses';
import WitnessesTable from './WitnessesTable';
import WitnessesEmpty from './WitnessesEmpty';
import { useIsMobile } from '@/hooks/use-mobile';

interface WitnessesManagementProps {
  onRefresh?: () => void;
}

const WitnessesManagement: React.FC<WitnessesManagementProps> = ({ onRefresh }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'all' | 'approved'>('pending');
  const isMobile = useIsMobile();
  
  const { 
    data: witnesses = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-witnesses'],
    queryFn: fetchAllWitnesses
  });
  
  const handleRefresh = async () => {
    try {
      await refetch();
      if (onRefresh) onRefresh();
      toast.success("Обявите са обновени успешно");
    } catch (error) {
      toast.error("Грешка при обновяване на обявите");
    }
  };
  
  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await updateWitnessStatus(id, true);
      toast.success("Обявата е одобрена успешно");
      refetch();
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Грешка при одобряване на обявата");
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await deleteWitness(id);
      toast.success("Обявата е отхвърлена успешно");
      refetch();
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Грешка при отхвърляне на обявата");
    } finally {
      setProcessingId(null);
    }
  };
  
  // Filter witnesses based on status
  const filteredWitnesses = witnesses.filter(witness => {
    if (statusFilter === 'pending') return !witness.is_approved;
    if (statusFilter === 'approved') return witness.is_approved;
    return true; // 'all'
  });
  
  if (error) {
    return (
      <div className="text-center py-16 bg-destructive/10 rounded-lg border border-destructive/20">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Грешка при зареждане на обявите</h3>
        <p className="text-muted-foreground mb-4">
          Възникна проблем при зареждането на обявите за свидетели.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Опитай отново
        </Button>
      </div>
    );
  }
  
  if (!isLoading && witnesses.length === 0) {
    return <WitnessesEmpty onRefresh={handleRefresh} isRefreshing={isLoading} />;
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            size="sm"
            className="text-xs py-1.5 px-2 w-full"
          >
            Чакащи
          </Button>
          <Button 
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
            size="sm"
            className="text-xs py-1.5 px-2 w-full"
          >
            Одобрени
          </Button>
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
            className="text-xs py-1.5 px-2 w-full"
          >
            Всички
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs py-1.5 px-2 w-full sm:w-auto mt-2 sm:mt-0"
        >
          <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Обновяване...' : 'Обнови'}
        </Button>
      </div>
      
      <WitnessesTable 
        witnesses={filteredWitnesses}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={isLoading}
        processingId={processingId}
      />
    </div>
  );
};

export default WitnessesManagement;
