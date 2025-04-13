
import React from 'react';
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
  return (
    <div className="flex justify-between items-start gap-6">
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold">{signal.title}</h1>
        <div className="text-sm text-muted-foreground">
          {formatDate(signal.created_at)}
        </div>
      </div>
    </div>
  );
};

export default SignalHeader;
