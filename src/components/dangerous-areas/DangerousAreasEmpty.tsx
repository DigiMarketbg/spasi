
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DangerousAreasEmptyProps {
  totalCount: number;
  searchActive: boolean;
}

const DangerousAreasEmpty = ({ totalCount, searchActive }: DangerousAreasEmptyProps) => {
  return (
    <div className="text-center py-16">
      <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">
        {totalCount === 0 
          ? 'Все още няма добавени опасни участъци' 
          : 'Няма намерени опасни участъци по зададените критерии'}
      </p>
    </div>
  );
};

export default DangerousAreasEmpty;
