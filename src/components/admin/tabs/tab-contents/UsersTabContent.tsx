
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import UsersManagement from '@/components/admin/UsersManagement';

interface UsersTabContentProps {
  users: any[];
  loadingUsers: boolean;
  onRefresh: () => void;
}

const UsersTabContent = ({ users, loadingUsers, onRefresh }: UsersTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на потребители</CardTitle>
        <CardDescription>
          Преглед и управление на всички регистрирани потребители.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersManagement 
          users={users} 
          loadingUsers={loadingUsers} 
          onRefresh={onRefresh} 
        />
      </CardContent>
    </Card>
  );
};

export default UsersTabContent;
