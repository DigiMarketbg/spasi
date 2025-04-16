
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import DangerousAreasManagement from '@/components/admin/dangerous-areas/DangerousAreasManagement';

interface DangerousAreasTabContentProps {
  onRefresh: () => void;
  loading?: boolean;
  pendingCount: number;
}

const DangerousAreasTabContent = ({ 
  onRefresh, 
  loading,
  pendingCount
}: DangerousAreasTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на опасни участъци</CardTitle>
        <CardDescription>
          Преглед и одобрение на подадени опасни участъци.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DangerousAreasManagement 
          onRefresh={onRefresh} 
          loading={loading} 
        />
      </CardContent>
    </Card>
  );
};

export default DangerousAreasTabContent;
