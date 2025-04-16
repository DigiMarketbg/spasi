
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SignalsTable from './signals/SignalsTable';
import SignalFilters from './signals/SignalFilters';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateSignalStatus } from '@/lib/api/signals';
import { useIsMobile } from '@/hooks/use-mobile';

const SignalsManagement = ({ signals: initialSignals, loadingSignals, onRefresh }) => {
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  const [signals, setSignals] = useState(initialSignals || []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('pending');

  // Update local signals when props change
  useEffect(() => {
    setSignals(initialSignals || []);
  }, [initialSignals]);

  // Filter signals by status
  const filteredSignals = signals.filter(signal => 
    statusFilter === 'all' || signal.status === statusFilter
  );

  // Manual refresh function
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success("Сигналите са обновени успешно");
    } catch (error) {
      toast.error("Грешка", {
        description: "Възникна проблем при обновяването на сигналите."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle signal status
  const updateSignalStatusHandler = async (id: string, newStatus: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      await updateSignalStatus(id, newStatus);

      // Update local state immediately
      setSignals(prevSignals => 
        prevSignals.map(signal => 
          signal.id === id 
            ? { ...signal, status: newStatus, is_approved: newStatus === 'approved' } 
            : signal
        )
      );

      toast.success(`Сигналът е ${newStatus === 'approved' ? 'одобрен' : 'отхвърлен'} успешно`);

      // Also trigger the parent refresh
      onRefresh();
    } catch (error: any) {
      toast.error("Грешка", {
        description: error.message || "Възникна проблем при промяната на статуса."
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Show empty state if no signals
  if (!loadingSignals && signals.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
        <div className="mx-auto flex flex-col items-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Няма налични сигнали</h3>
          <p className="text-muted-foreground mb-4">Все още няма създадени сигнали за преглед.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Обновяване...' : 'Обнови'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-center mb-4 gap-2`}>
        <div className={`flex gap-2 ${isMobile ? 'w-full grid grid-cols-2' : ''}`}>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            className={isMobile ? 'w-full' : ''}
          >
            Чакащи сигнали
          </Button>
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={isMobile ? 'w-full' : ''}
          >
            Всички сигнали
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className={isMobile ? 'w-full mt-2' : 'ml-auto'}
        >
          <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Обновяване...' : 'Обнови'}
        </Button>
      </div>

      <SignalsTable 
        signals={filteredSignals}
        onApprove={(id) => updateSignalStatusHandler(id, 'approved')}
        onReject={(id) => updateSignalStatusHandler(id, 'rejected')}
        processingId={processingId}
        loading={loadingSignals}
      />
    </div>
  );
};

export default SignalsManagement;
