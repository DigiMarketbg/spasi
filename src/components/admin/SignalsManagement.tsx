
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
import { useToast } from '@/hooks/use-toast';
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
