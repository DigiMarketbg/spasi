
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PartnerRequestsManagement from '@/components/admin/PartnerRequestsManagement';

interface PartnersTabContentProps {
  partnerRequests?: any[];
  loadingPartnerRequests?: boolean;
  onRefresh?: () => void;
  pendingRequestsCount?: number;
}

const PartnersTabContent = ({ 
  partnerRequests = [], 
  loadingPartnerRequests = false, 
  onRefresh = () => {}, 
  pendingRequestsCount = 0
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
          requests={partnerRequests} 
          loadingRequests={loadingPartnerRequests} 
          onRefresh={onRefresh} 
        />
      </CardContent>
    </Card>
  );
};

export default PartnersTabContent;
