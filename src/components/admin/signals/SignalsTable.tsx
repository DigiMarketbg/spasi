
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
import { AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

export interface SignalData {
  id: string;
  title: string;
  description?: string;
  category: string;
  city: string;
  status: string;
  created_at: string;
  is_approved?: boolean;
  is_urgent?: boolean;
  user_full_name?: string;
  user_email?: string;
}

interface SignalsTableProps {
  signals: SignalData[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleUrgent?: (id: string, isUrgent: boolean) => void;
  processingId?: string | null;
  loading?: boolean;
}

const SignalsTable: React.FC<SignalsTableProps> = ({
  signals,
  onApprove,
  onReject,
  onToggleUrgent,
  processingId = null,
  loading = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('bg-BG');
  };

  if (loading) {
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
            {Array(3).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-9 w-32" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

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
            <TableHead>Спешен</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signals.map((signal) => (
            <TableRow key={signal.id} className={signal.is_urgent ? "bg-red-50 dark:bg-red-900/10" : ""}>
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
                {signal.status === 'approved' && onToggleUrgent && (
                  <div className="flex items-center">
                    <Checkbox 
                      id={`urgent-${signal.id}`} 
                      checked={!!signal.is_urgent}
                      onCheckedChange={(checked) => {
                        onToggleUrgent(signal.id, checked === true);
                      }}
                      disabled={!!processingId}
                    />
                    <label htmlFor={`urgent-${signal.id}`} className="ml-2 text-sm font-medium">
                      Спешен
                    </label>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {signal.status === 'pending' && (
                  <div className="flex gap-2">
                    {processingId === signal.id ? (
                      <Button size="sm" disabled>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Обработка...
                      </Button>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => onApprove(signal.id)}
                          disabled={!!processingId}
                        >
                          Одобри
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onReject(signal.id)}
                          disabled={!!processingId}
                        >
                          Отхвърли
                        </Button>
                      </>
                    )}
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
