
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface WitnessesEmptyProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const WitnessesEmpty: React.FC<WitnessesEmptyProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
      <div className="mx-auto flex flex-col items-center">
        <h3 className="text-lg font-medium mb-2">Няма налични обяви</h3>
        <p className="text-muted-foreground mb-4">Все още няма създадени обяви за свидетели.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Обновяване...' : 'Обнови'}
        </Button>
      </div>
    </div>
  );
};

export default WitnessesEmpty;
