
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignalFilters from './signals/SignalFilters';
import SignalsTable from './signals/SignalsTable';
import SignalsPagination from './signals/SignalsPagination';
import SignalsEmptyState from './signals/SignalsEmptyState';

interface SignalData {
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

interface SignalsManagementProps {
  signals: SignalData[];
  loadingSignals: boolean;
  onRefresh: () => void;
}

const SignalsManagement = ({ signals, loadingSignals, onRefresh }: SignalsManagementProps) => {
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

      // Trigger refresh of signals data
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

      // Trigger refresh of signals data
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

      // Trigger refresh of signals data
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
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
        
      if (error) throw error;
      
      toast({
        title: 'Успешно',
        description: 'Всички сигнали бяха изтрити успешно.',
      });
      
      // Close dialog and refresh
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

  // Filter signals based on search, category, city, and status filters
  const filteredSignals = signals.filter(signal => {
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

  // Get current signals for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSignals = filteredSignals.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, cityFilter, statusFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на сигнали</CardTitle>
        <CardDescription>
          Преглеждайте и управлявайте всички сигнали в системата
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Delete All Button and Filters Row */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1 mb-2 sm:mb-0"
                disabled={signals.length === 0 || isDeletingAll}
              >
                <Trash2 className="h-4 w-4" />
                Изтрий всички сигнали
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Изтриване на всички сигнали</AlertDialogTitle>
                <AlertDialogDescription>
                  Сигурни ли сте, че искате да изтриете ВСИЧКИ сигнали? Това действие не може да бъде отменено и ще изтрие всички {signals.length} сигнала.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отказ</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={deleteAllSignals} 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeletingAll}
                >
                  {isDeletingAll ? 'Изтриване...' : 'Изтрий всички'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm"
            className="mb-2 sm:mb-0"
          >
            Обнови
          </Button>
        </div>

        {/* Filters */}
        <SignalFilters 
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          cityFilter={cityFilter}
          statusFilter={statusFilter}
          itemsPerPage={itemsPerPage}
          setSearchTerm={setSearchTerm}
          setCategoryFilter={setCategoryFilter}
          setCityFilter={setCityFilter}
          setStatusFilter={setStatusFilter}
          setItemsPerPage={setItemsPerPage}
          totalItems={filteredSignals.length}
          startIndex={indexOfFirstItem}
          endIndex={indexOfLastItem}
        />

        {loadingSignals || filteredSignals.length === 0 ? (
          <SignalsEmptyState loading={loadingSignals} />
        ) : (
          <div className="overflow-x-auto">
            <SignalsTable 
              signals={currentSignals}
              formatDate={formatDate}
              onViewDetails={viewSignalDetails}
              onToggleApproval={toggleSignalApproval}
              onToggleResolution={toggleSignalResolution}
              onDelete={deleteSignal}
            />
            
            <SignalsPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalsManagement;
