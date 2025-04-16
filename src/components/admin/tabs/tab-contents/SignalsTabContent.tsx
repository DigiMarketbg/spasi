
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import SignalsManagement from '@/components/admin/SignalsManagement';

interface SignalsTabContentProps {
  signals: any[];
  loadingSignals: boolean;
  onRefresh: () => void;
}

const SignalsTabContent = ({ signals, loadingSignals, onRefresh }: SignalsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на сигнали</CardTitle>
        <CardDescription>
          Преглед на всички сигнали в системата, одобрение и отбелязване като решени.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignalsManagement 
          signals={signals} 
          loadingSignals={loadingSignals} 
          onRefresh={onRefresh} 
        />
      </CardContent>
    </Card>
  );
};

export default SignalsTabContent;
