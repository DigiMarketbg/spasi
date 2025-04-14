
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import SignalsTable from './signals/SignalsTable';
import SignalFilters from './signals/SignalFilters';

const SignalsManagement = ({ signals, loadingSignals, onRefresh }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('pending');

  // Filter signals by status
  const filteredSignals = signals.filter(signal => 
    statusFilter === 'all' || signal.status === statusFilter
  );

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

      toast({
        title: "Успешно",
        description: `Сигналът е ${newStatus === 'approved' ? 'одобрен' : 'отхвърлен'}.`
      });

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
      <div className="flex gap-2 mb-4">
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

      <SignalsTable 
        signals={filteredSignals}
        onApprove={(id) => updateSignalStatus(id, 'approved')}
        onReject={(id) => updateSignalStatus(id, 'rejected')}
      />
    </div>
  );
};

export default SignalsManagement;
