
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import WitnessesManagement from '@/components/admin/witnesses/WitnessesManagement';
import { TabsContent } from '@/components/ui/tabs';

interface WitnessesTabContentProps {
  value: string;
  onRefresh?: () => void;
}

const WitnessesTabContent: React.FC<WitnessesTabContentProps> = ({ value, onRefresh }) => {
  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Управление на обяви за свидетели</CardTitle>
          <CardDescription>
            Преглед и управление на обявите за свидетели - одобрение и изтриване на обяви.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WitnessesManagement onRefresh={onRefresh} />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default WitnessesTabContent;
