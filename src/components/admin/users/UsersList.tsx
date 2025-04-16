
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import UserActions from './UserActions';
import { Tables } from '@/integrations/supabase/types';

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean | null;
  role?: string;
}

interface UsersListProps {
  users: UserData[];
  onRefresh: () => void;
  formatDate: (dateString: string | null) => string;
}

const UsersList: React.FC<UsersListProps> = ({ users, onRefresh, formatDate }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Име</TableHead>
          <TableHead>Имейл</TableHead>
          <TableHead>Регистриран на</TableHead>
          <TableHead>Роля</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.full_name || 'Неизвестно'}</TableCell>
            <TableCell>{user.email || 'Неизвестно'}</TableCell>
            <TableCell>{formatDate(user.created_at)}</TableCell>
            <TableCell>
              {user.is_admin ? (
                <Badge>Администратор</Badge>
              ) : user.role === 'moderator' ? (
                <Badge variant="secondary">Модератор</Badge>
              ) : (
                <Badge variant="outline">Потребител</Badge>
              )}
            </TableCell>
            <TableCell>
              <UserActions 
                userId={user.id} 
                isAdmin={user.is_admin || false} 
                role={user.role}
                onRefresh={onRefresh} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersList;
