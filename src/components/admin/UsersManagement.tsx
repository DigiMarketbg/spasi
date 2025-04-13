
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean;
}

interface UsersManagementProps {
  users: UserData[];
  loadingUsers: boolean;
  onRefresh: () => void;
}

const UsersManagement = ({ users, loadingUsers, onRefresh }: UsersManagementProps) => {
  const { toast } = useToast();

  // Toggle user admin status
  const toggleUserAdminStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus 
          ? "Потребителят е направен администратор." 
          : "Администраторските права на потребителя са премахнати.",
      });

      // Trigger refresh of users data
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на потребителя.",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на потребители</CardTitle>
        <CardDescription>
          Преглеждайте и управлявайте всички потребители в системата
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadingUsers ? (
          <div className="text-center py-8">Зареждане на потребителите...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
            <p>Няма потребители в системата</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Име</TableHead>
                  <TableHead>Имейл</TableHead>
                  <TableHead>Регистриран на</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'Няма име'}</TableCell>
                    <TableCell>{user.email || 'Няма имейл'}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_admin ? "default" : "outline"}>
                        {user.is_admin ? 'Администратор' : 'Потребител'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant={user.is_admin ? "destructive" : "default"}
                        onClick={() => toggleUserAdminStatus(user.id, user.is_admin)}
                      >
                        {user.is_admin ? 'Премахни админ права' : 'Направи администратор'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
