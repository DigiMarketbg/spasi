
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ReportDialog from './ReportDialog';
import { categoryTranslations } from '@/lib/card-styles';

interface SignalHeaderProps {
  signal: {
    id: string;
    title: string;
    category: string;
    city: string;
    created_at: string;
  };
  formatDate: (dateString: string) => string;
}

const SignalHeader: React.FC<SignalHeaderProps> = ({ signal, formatDate }) => {
  const translatedCategory = categoryTranslations[signal.category] || signal.category;
  
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="space-y-2 w-full">
        <h1 className="text-2xl md:text-3xl font-semibold">{signal.title}</h1>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{translatedCategory}</Badge>
            <span>•</span>
            <span>{signal.city}</span>
            <span>•</span>
            <span>{formatDate(signal.created_at)}</span>
          </div>
          
          <ReportDialog signalId={signal.id} />
        </div>
      </div>
    </div>
  );
};

export default SignalHeader;
