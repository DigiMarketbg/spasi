
import React, { useState } from 'react';
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
import { Check, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignalData {
  id: string;
  title: string;
  category: string;
  city: string;
  created_at: string;
  is_approved: boolean;
  is_resolved: boolean;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface SignalsManagementProps {
  signals: SignalData[];
  loadingSignals: boolean;
  onRefresh: () => void;
}

const SignalsManagement = ({ signals, loadingSignals, onRefresh }: SignalsManagementProps) => {
  const { toast } = useToast();

  // Toggle signal approval
  const toggleSignalApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е одобрен." : "Одобрението на сигнала е премахнато.",
      });

      // Trigger refresh of signals data
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Toggle signal resolution
  const toggleSignalResolution = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_resolved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е маркиран като разрешен." : "Сигналът е маркиран като неразрешен.",
      });

      // Trigger refresh of signals data
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на сигнали</CardTitle>
        <CardDescription>
          Преглеждайте и управлявайте всички сигнали в системата
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadingSignals ? (
          <div className="text-center py-8">Зареждане на сигналите...</div>
        ) : signals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
            <p>Няма сигнали в системата</p>
          </div>
        ) : (
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
                    <TableCell>{signal.profiles?.full_name || signal.profiles?.email || 'Неизвестен'}</TableCell>
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
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={signal.is_approved ? "destructive" : "default"}
                          onClick={() => toggleSignalApproval(signal.id, signal.is_approved)}
                        >
                          {signal.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {signal.is_approved ? 'Премахни одобрение' : 'Одобри'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant={signal.is_resolved ? "destructive" : "default"}
                          onClick={() => toggleSignalResolution(signal.id, signal.is_resolved)}
                        >
                          {signal.is_resolved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {signal.is_resolved ? 'Маркирай като неразрешен' : 'Маркирай като разрешен'}
                        </Button>
                      </div>
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

export default SignalsManagement;
