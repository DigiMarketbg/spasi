
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AreaFiltersProps {
  showPending: boolean;
  setShowPending: (value: boolean) => void;
  pendingCount: number;
  loading: boolean;
  onRefresh: () => void;
}

const AreaFilters: React.FC<AreaFiltersProps> = ({
  showPending,
  setShowPending,
  pendingCount,
  loading,
  onRefresh
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
      <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
        Опасни участъци
        {pendingCount > 0 && (
          <span className="text-xs sm:text-sm bg-orange-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
            {pendingCount} чакащи
          </span>
        )}
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant={showPending ? "default" : "outline"}
            onClick={() => setShowPending(true)}
            size="sm"
            className="text-xs py-1.5 px-2 w-full"
          >
            Чакащи
          </Button>
          <Button
            variant={!showPending ? "default" : "outline"}
            onClick={() => setShowPending(false)}
            size="sm"
            className="text-xs py-1.5 px-2 w-full"
          >
            Всички
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={loading}
          size="sm"
          className="flex items-center gap-1 text-xs py-1.5 px-2 w-full sm:w-auto"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Обнови
        </Button>
      </div>
    </div>
  );
};

export default AreaFilters;
