
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle } from 'lucide-react';

export interface SignalData {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  status: string;
  created_at: string;
  is_approved?: boolean;
  user_full_name?: string;
  user_email?: string;
}

interface SignalsTableProps {
  signals: SignalData[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const SignalsTable: React.FC<SignalsTableProps> = ({
  signals,
  onApprove,
  onReject
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('bg-BG');
  };

  if (signals.length === 0) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Няма сигнали по зададените критерии
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Заглавие</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Град</TableHead>
            <TableHead>Подал</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signals.map((signal) => (
            <TableRow key={signal.id}>
              <TableCell className="font-medium">{signal.title}</TableCell>
              <TableCell>{signal.category}</TableCell>
              <TableCell>{signal.city}</TableCell>
              <TableCell>{signal.user_full_name || signal.user_email || 'Неизвестен'}</TableCell>
              <TableCell>{formatDate(signal.created_at)}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    signal.status === 'pending' ? 'outline' : 
                    signal.status === 'approved' ? 'default' : 
                    'destructive'
                  }
                >
                  {signal.status === 'pending' ? 'Чакащ' : 
                  signal.status === 'approved' ? 'Одобрен' : 
                  'Отхвърлен'}
                </Badge>
              </TableCell>
              <TableCell>
                {signal.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => onApprove(signal.id)}
                    >
                      Одобри
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onReject(signal.id)}
                    >
                      Отхвърли
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SignalsTable;
