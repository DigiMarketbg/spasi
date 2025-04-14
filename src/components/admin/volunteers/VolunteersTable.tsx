
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Volunteer } from '@/types/volunteer';
import VolunteerActions from './VolunteerActions';

interface VolunteersTableProps {
  volunteers: Volunteer[];
  loadingVolunteers: boolean;
  handleApprove: (id: string, approved: boolean) => Promise<void>;
}

const VolunteersTable: React.FC<VolunteersTableProps> = ({
  volunteers,
  loadingVolunteers,
  handleApprove,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Име</TableHead>
            <TableHead>Имейл</TableHead>
            <TableHead className="hidden md:table-cell">Град</TableHead>
            <TableHead className="hidden md:table-cell">Помощ в</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingVolunteers ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="animate-pulse">Зареждане...</div>
              </TableCell>
            </TableRow>
          ) : volunteers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Няма намерени доброволци съответстващи на филтрите.
              </TableCell>
            </TableRow>
          ) : (
            volunteers.map((volunteer) => (
              <TableRow key={volunteer.id}>
                <TableCell>{volunteer.full_name}</TableCell>
                <TableCell>{volunteer.email}</TableCell>
                <TableCell className="hidden md:table-cell">{volunteer.city}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {volunteer.can_help_with.map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill === 'transport' && 'Транспорт'}
                        {skill === 'food' && 'Храна'}
                        {skill === 'blood' && 'Кръв'}
                        {skill === 'logistics' && 'Логистика'}
                        {skill === 'other' && 'Друго'}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={volunteer.is_approved ? "default" : "outline"}>
                    {volunteer.is_approved ? 'Одобрен' : 'Чакащ'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <VolunteerActions 
                    id={volunteer.id}
                    isApproved={volunteer.is_approved}
                    onApprove={handleApprove}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VolunteersTable;
