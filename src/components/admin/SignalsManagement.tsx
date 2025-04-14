
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SignalFilters from './signals/SignalFilters';
import SignalsTable from './signals/SignalsTable';
import SignalsPagination from './signals/SignalsPagination';
import SignalsEmptyState from './signals/SignalsEmptyState';
import DeleteAllDialog from './signals/DeleteAllDialog';
import { useSignalsManagement, SignalData } from './signals/useSignalsManagement';

interface SignalsManagementProps {
  signals: SignalData[];
  loadingSignals: boolean;
  onRefresh: () => void;
}

const SignalsManagement = ({ signals, loadingSignals, onRefresh }: SignalsManagementProps) => {
  const {
    // State
    currentPage,
    itemsPerPage,
    searchTerm,
    categoryFilter,
    cityFilter,
    statusFilter,
    isDeleteAllDialogOpen,
    isDeletingAll,
    
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
  } = useSignalsManagement(signals, onRefresh);

  // Filter signals based on filter criteria
  const filteredSignals = filterSignals(signals);

  // Get current signals for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSignals = filteredSignals.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на сигнали</CardTitle>
        <CardDescription>
          Преглеждайте и управлявайте всички сигнали в системата
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Delete All Button and Refresh Button */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <DeleteAllDialog 
            isOpen={isDeleteAllDialogOpen}
            onOpenChange={setIsDeleteAllDialogOpen}
            onDeleteAll={deleteAllSignals}
            isDeleting={isDeletingAll}
            signalsCount={signals.length}
          />

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
