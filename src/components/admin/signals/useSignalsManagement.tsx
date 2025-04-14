
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SignalData {
  id: string;
  title: string;
  category: string;
  city: string;
  created_at: string;
  is_approved: boolean;
  is_resolved: boolean;
  user_id: string;
  user_full_name?: string;
  user_email?: string;
}

export const useSignalsManagement = (
  signals: SignalData[],
  onRefresh: () => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Всички категории");
  const [cityFilter, setCityFilter] = useState("Всички градове");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Delete all dialog state
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Toggle signal approval
  const toggleSignalApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е одобрен." : "Одобрението на сигнала е премахнато.",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Toggle signal resolution
  const toggleSignalResolution = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_resolved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е маркиран като разрешен." : "Сигналът е маркиран като неразрешен.",
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Delete a single signal
  const deleteSignal = async (id: string) => {
    try {
      setProcessingId(id);
      
      const { error } = await supabase
        .from('signals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Сигналът беше изтрит успешно.",
      });

      onRefresh();
    } catch (error: any) {
      console.error('Error deleting signal:', error);
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при изтриването на сигнала.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Delete all signals
  const deleteAllSignals = async () => {
    try {
      setIsDeletingAll(true);
      
      const { error } = await supabase
        .from('signals')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Всички сигнали бяха изтрити успешно.',
      });
      
      setIsDeleteAllDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      console.error('Error deleting all signals:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при изтриването на сигналите.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  // View signal details
  const viewSignalDetails = (id: string) => {
    navigate(`/admin/signals/${id}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Filter signals
  const filterSignals = (signals: SignalData[]) => {
    return signals.filter(signal => {
      // Search term filter (title, category, city)
      const matchesSearch = !searchTerm 
        || signal.title.toLowerCase().includes(searchTerm.toLowerCase())
        || signal.category.toLowerCase().includes(searchTerm.toLowerCase())
        || signal.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === "Всички категории" || signal.category === categoryFilter;
      
      // City filter
      const matchesCity = cityFilter === "Всички градове" || signal.city === cityFilter;
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === "approved") {
        matchesStatus = signal.is_approved;
      } else if (statusFilter === "unapproved") {
        matchesStatus = !signal.is_approved;
      } else if (statusFilter === "resolved") {
        matchesStatus = signal.is_resolved;
      } else if (statusFilter === "unresolved") {
        matchesStatus = !signal.is_resolved;
      }
      
      return matchesSearch && matchesCategory && matchesCity && matchesStatus;
    });
  };

  return {
    // State
    currentPage,
    itemsPerPage,
    searchTerm,
    categoryFilter,
    cityFilter,
    statusFilter,
    isDeleteAllDialogOpen,
    isDeletingAll,
    processingId,
    
    // Setters
    setCurrentPage,
    setItemsPerPage,
    setSearchTerm,
    setCategoryFilter,
    setCityFilter,
    setStatusFilter,
    setIsDeleteAllDialogOpen,
    
    // Actions
    toggleSignalApproval,
    toggleSignalResolution,
    deleteSignal,
    deleteAllSignals,
    viewSignalDetails,
    formatDate,
    filterSignals
  };
};
