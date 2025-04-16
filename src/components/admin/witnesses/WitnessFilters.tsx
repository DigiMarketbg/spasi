
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WitnessFiltersProps {
  statusFilter: 'pending' | 'all' | 'approved';
  setStatusFilter: (value: 'pending' | 'all' | 'approved') => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const WitnessFilters: React.FC<WitnessFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  onRefresh,
  isLoading
}) => {
  const isMobile = useIsMobile();
  
  return (
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
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1 text-xs py-1.5 px-2 w-full sm:w-auto mt-2 sm:mt-0"
      >
        <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Обновяване...' : 'Обнови'}
      </Button>
    </div>
  );
};

export default WitnessFilters;
