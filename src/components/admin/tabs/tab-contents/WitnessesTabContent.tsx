
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface WitnessesTabContentProps {
  pendingCount?: number;
}

const WitnessesTabContent = ({ pendingCount = 0 }: WitnessesTabContentProps) => {
  const navigate = useNavigate();

  const goToWitnessesManagement = () => {
    navigate('/witnesses-management');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Свидетели</CardTitle>
        <CardDescription>
          Управление на обяви за свидетели
          {pendingCount > 0 && (
            <span className="ml-2 text-amber-600 font-medium">
              ({pendingCount} чакащи одобрение)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Преглеждайте и одобрявайте обяви за свидетели.</p>
        <Button onClick={goToWitnessesManagement}>
          Управление на обяви за свидетели
        </Button>
      </CardContent>
    </Card>
  );
};

export default WitnessesTabContent;
