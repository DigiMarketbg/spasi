
import React, { useState } from 'react';
import { Check, X, Eye, Trash2, Loader2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface SignalData {
  id: string;
  title: string;
  category: string;
  city: string;
  created_at: string;
  is_approved: boolean;
  is_resolved: boolean;
  user_id: string;
  user_full_name?: string;
  user_email?: string;
}

interface SignalsTableProps {
  signals: SignalData[];
  formatDate: (dateString: string) => string;
  onViewDetails: (id: string) => void;
  onToggleApproval: (id: string, currentStatus: boolean) => Promise<void>;
  onToggleResolution: (id: string, currentStatus: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const SignalsTable: React.FC<SignalsTableProps> = ({
  signals,
  formatDate,
  onViewDetails,
  onToggleApproval,
  onToggleResolution,
  onDelete
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedSignalId(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSignalId) {
      setDeletingId(selectedSignalId);
      try {
        await onDelete(selectedSignalId);
      } catch (error) {
        console.error("Error deleting signal:", error);
      } finally {
        setDeletingId(null);
        setConfirmDialogOpen(false);
        setSelectedSignalId(null);
      }
    }
  };

  return (
    <>
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
                <div className="flex flex-col gap-1">
                  <Badge variant={signal.is_approved ? "default" : "outline"}>
                    {signal.is_approved ? 'Одобрен' : 'Неодобрен'}
                  </Badge>
                  <Badge variant={signal.is_resolved ? "success" : "destructive"}>
                    {signal.is_resolved ? 'Разрешен' : 'Неразрешен'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewDetails(signal.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Детайли
                  </Button>
                  <Button 
                    size="sm" 
                    variant={signal.is_approved ? "destructive" : "default"}
                    onClick={() => onToggleApproval(signal.id, signal.is_approved)}
                  >
                    {signal.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    {signal.is_approved ? 'Премахни одобрение' : 'Одобри'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant={signal.is_resolved ? "destructive" : "default"}
                    onClick={() => onToggleResolution(signal.id, signal.is_resolved)}
                  >
                    {signal.is_resolved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    {signal.is_resolved ? 'Маркирай като неразрешен' : 'Маркирай като разрешен'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteClick(signal.id)}
                    disabled={deletingId === signal.id}
                  >
                    {deletingId === signal.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Изтриване...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Изтрий
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изтриване на сигнал</AlertDialogTitle>
            <AlertDialogDescription>
              Сигурни ли сте, че искате да изтриете този сигнал? Това действие не може да бъде отменено.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отказ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Изтрий
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SignalsTable;
