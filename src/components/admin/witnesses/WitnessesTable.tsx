
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Witness } from '@/types/witness';
import WitnessActions from './WitnessActions';

interface WitnessesTableProps {
  witnesses: Witness[];
  isLoading: boolean;
  processingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const WitnessesTable: React.FC<WitnessesTableProps> = ({
  witnesses,
  isLoading,
  processingId,
  onApprove,
  onReject
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border rounded-md">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!witnesses.length) {
    return (
      <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Няма намерени обяви с избрания филтър.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Заглавие</TableHead>
            <TableHead>Местоположение</TableHead>
            <TableHead>Дата на обявата</TableHead>
            <TableHead>Валидна до</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {witnesses.map(witness => {
            const isExpired = new Date(witness.expires_at) < new Date();
            return (
              <TableRow key={witness.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {witness.title}
                </TableCell>
                <TableCell>{witness.location}</TableCell>
                <TableCell>{format(new Date(witness.created_at), 'dd.MM.yyyy', { locale: bg })}</TableCell>
                <TableCell>{format(new Date(witness.expires_at), 'dd.MM.yyyy', { locale: bg })}</TableCell>
                <TableCell>
                  {witness.is_approved ? (
                    isExpired ? (
                      <Badge variant="outline" className="bg-muted">Изтекла</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Одобрена</Badge>
                    )
                  ) : (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">Чакаща</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <WitnessActions 
                    witness={witness}
                    onApprove={onApprove}
                    onReject={onReject}
                    isProcessing={processingId === witness.id}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default WitnessesTable;
