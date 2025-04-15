
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SignalsTable from './signals/SignalsTable';
import SignalFilters from './signals/SignalFilters';
import { RefreshCcw } from 'lucide-react';

const SignalsManagement = ({ signals: initialSignals, loadingSignals, onRefresh }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [signals, setSignals] = useState(initialSignals || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      toast({
        title: "Обновено",
        description: "Сигналите са обновени успешно."
      });
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при обновяването на сигналите.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle signal status
  const updateSignalStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ 
          status: newStatus, 
          is_approved: newStatus === 'approved' 
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setSignals(prevSignals => 
        prevSignals.map(signal => 
          signal.id === id 
            ? { ...signal, status: newStatus, is_approved: newStatus === 'approved' } 
            : signal
        )
      );

      toast({
        title: "Успешно",
        description: `Сигналът е ${newStatus === 'approved' ? 'одобрен' : 'отхвърлен'}.`
      });

      // Also trigger the parent refresh
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
          >
            Чакащи сигнали
          </Button>
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            Всички сигнали
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="ml-auto"
        >
          <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Обновяване...' : 'Обнови'}
        </Button>
      </div>

      <SignalsTable 
        signals={filteredSignals}
        onApprove={(id) => updateSignalStatus(id, 'approved')}
        onReject={(id) => updateSignalStatus(id, 'rejected')}
      />
    </div>
  );
};

export default SignalsManagement;
