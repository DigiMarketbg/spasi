
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Rescuer {
  id: string;
  name: string;
  city: string;
  help_description: string;
  help_date: string;
  image_url?: string;
  created_at: string;
}

interface RescuersTableProps {
  rescuers: Rescuer[];
  isLoading: boolean;
  onEdit: (rescuer: Rescuer) => void;
  onDelete: (id: string) => void;
}

const RescuersTable: React.FC<RescuersTableProps> = ({
  rescuers,
  isLoading,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Зареждане...</p>
      </div>
    );
  }

  if (!rescuers || rescuers.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">Няма добавени спасители все още</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Име</TableHead>
          <TableHead>Град</TableHead>
          <TableHead>Описание на помощта</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Снимка</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rescuers.map((rescuer) => (
          <TableRow key={rescuer.id}>
            <TableCell className="font-medium">{rescuer.name}</TableCell>
            <TableCell>{rescuer.city}</TableCell>
            <TableCell>
              {rescuer.help_description.length > 100 
                ? `${rescuer.help_description.substring(0, 100)}...` 
                : rescuer.help_description}
            </TableCell>
            <TableCell>{formatDate(rescuer.help_date)}</TableCell>
            <TableCell>
              {rescuer.image_url ? (
                <div className="w-12 h-12 rounded overflow-hidden">
                  <img 
                    src={rescuer.image_url} 
                    alt={rescuer.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Няма</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onEdit(rescuer)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onDelete(rescuer.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RescuersTable;
