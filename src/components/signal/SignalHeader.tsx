
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ReportDialog from './ReportDialog';

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
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-semibold mb-2">{signal.title}</h1>
        <div className="flex items-center gap-2">
          <Badge>{signal.category}</Badge>
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
