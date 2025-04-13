
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
  const translatedCategory = categoryTranslations[signal.category] || signal.category;
  
  return (
    <div className="flex justify-between items-start gap-6"> {/* Increased gap from 4 to 6 */}
      <div className="space-y-4"> {/* Increased vertical spacing from 2 to 4 */}
        <h1 className="text-2xl md:text-3xl font-semibold">{signal.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground"> {/* Increased gap from 2 to 3 */}
          <span>{formatDate(signal.created_at)}</span>
          <Badge variant="outline">{translatedCategory}</Badge>
        </div>
      </div>
      
      <ReportDialog signalId={signal.id} />
    </div>
  );
};

export default SignalHeader;
