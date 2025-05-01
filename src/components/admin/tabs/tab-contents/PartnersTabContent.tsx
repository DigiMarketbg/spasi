
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PartnerRequestsManagement from '@/components/admin/PartnerRequestsManagement';

interface PartnersTabContentProps {
  requests: any[];
  loadingRequests: boolean;
  onRefresh: () => void;
  pendingRequestsCount: number;
}

const PartnersTabContent = ({ 
  requests, 
  loadingRequests, 
  onRefresh,
  pendingRequestsCount
}: PartnersTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Заявки за партньорство</CardTitle>
        <CardDescription>
          Преглед и управление на заявките за партньорство.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PartnerRequestsManagement 
          requests={requests} 
          loadingRequests={loadingRequests} 
          onRefresh={onRefresh} 
        />
      </CardContent>
    </Card>
  );
};

export default PartnersTabContent;
