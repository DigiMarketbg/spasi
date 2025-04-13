
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ReportDialog from './ReportDialog';
import { categoryTranslations } from '@/lib/card-styles';

interface SignalHeaderProps {
  signal: {
    id: string;
    title: string;
    category: string;
    created_at: string;
  };
  formatDate: (dateString: string) => string;
}

const SignalHeader: React.FC<SignalHeaderProps> = ({ signal, formatDate }) => {
  // Translate category
  const translatedCategory = categoryTranslations[signal.category] || signal.category;
  
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-semibold mb-2">{signal.title}</h1>
        <div className="flex items-center gap-2">
          <Badge>{translatedCategory}</Badge>
          <span className="text-muted-foreground">
            {formatDate(signal.created_at)}
          </span>
        </div>
      </div>
      
      <ReportDialog signalId={signal.id} />
    </div>
  );
};

export default SignalHeader;
