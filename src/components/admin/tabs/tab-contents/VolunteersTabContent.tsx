
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface VolunteersTabContentProps {
  pendingCount?: number;
}

const VolunteersTabContent = ({ pendingCount = 0 }: VolunteersTabContentProps) => {
  const navigate = useNavigate();

  const goToVolunteersManagement = () => {
    navigate('/admin/volunteers');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Доброволци</CardTitle>
        <CardDescription>
          Управление на доброволци в платформата
          {pendingCount > 0 && (
            <span className="ml-2 text-amber-600 font-medium">
              ({pendingCount} чакащи одобрение)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Управлявайте заявки от доброволци и техните акаунти.</p>
        <Button onClick={goToVolunteersManagement}>
          Управление на доброволци
        </Button>
      </CardContent>
    </Card>
  );
};

export default VolunteersTabContent;
