
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';

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
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-orange-500" />
        Опасни участъци
        {pendingCount > 0 && (
          <span className="text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
            {pendingCount} чакащи
          </span>
        )}
      </h2>
      <div className="flex gap-2">
        <Button
          variant={showPending ? "default" : "outline"}
          onClick={() => setShowPending(true)}
          size="sm"
        >
          Чакащи одобрение
        </Button>
        <Button
          variant={!showPending ? "default" : "outline"}
          onClick={() => setShowPending(false)}
          size="sm"
        >
          Всички
        </Button>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={loading}
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Обнови
        </Button>
      </div>
    </div>
  );
};

export default AreaFilters;
