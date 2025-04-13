
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UsersEmptyStateProps {
  loading: boolean;
}

const UsersEmptyState: React.FC<UsersEmptyStateProps> = ({ loading }) => {
  if (loading) {
    return <div className="text-center py-8">Зареждане на потребителите...</div>;
  }
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
      <p>Няма намерени потребители</p>
    </div>
  );
};

export default UsersEmptyState;
