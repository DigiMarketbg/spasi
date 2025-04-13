
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SignalsEmptyStateProps {
  loading: boolean;
}

const SignalsEmptyState: React.FC<SignalsEmptyStateProps> = ({ loading }) => {
  if (loading) {
    return <div className="text-center py-8">Зареждане на сигналите...</div>;
  }
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
      <p>Няма намерени сигнали</p>
    </div>
  );
};

export default SignalsEmptyState;
