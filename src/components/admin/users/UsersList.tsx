
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

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean;
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
              <UserActions 
                userId={user.id} 
                isAdmin={user.is_admin} 
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
