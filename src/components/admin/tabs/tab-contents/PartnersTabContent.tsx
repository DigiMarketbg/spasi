
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PartnerRequestsManagement from '@/components/admin/PartnerRequestsManagement';
import { TabsContent } from '@/components/ui/tabs';

interface PartnersTabContentProps {
  requests: any[];
  loadingRequests: boolean;
  onRefresh?: () => void;
  pendingRequestsCount: number;
}

const PartnersTabContent = ({ 
  requests, 
  loadingRequests, 
  onRefresh,
  pendingRequestsCount
}: PartnersTabContentProps) => {
  return (
    <TabsContent value="partners" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Заявки за партньорство</CardTitle>
          <CardDescription>
            Преглед и управление на заявките за партньорство.
            {pendingRequestsCount > 0 && (
              <span className="text-amber-600 font-medium ml-2">
                ({pendingRequestsCount} чакащи)
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartnerRequestsManagement 
            requests={requests} 
            loadingRequests={loadingRequests} 
            onRefresh={onRefresh || (() => {})} 
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PartnersTabContent;
