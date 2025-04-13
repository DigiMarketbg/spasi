
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportDialogProps {
  signalId: string;
}

const ReportDialog: React.FC<ReportDialogProps> = ({ signalId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportReason, setReportReason] = useState('');

  const handleReportSignal = async () => {
    if (!user || !signalId || !reportReason) {
      toast({
        title: "Грешка",
        description: "Моля, влезте в профила си и изберете причина за докладване.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          signal_id: signalId,
          reported_by: user.id,
          reason: reportReason
        });

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Сигналът е докладван. Благодарим ви!",
      });
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Не можахме да докладваме сигнала. Моля, опитайте отново.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="text-xs px-3 py-1 h-8">
          <Flag className="h-3 w-3 mr-1" />
          Докладвай
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Докладване на сигнал</AlertDialogTitle>
          <AlertDialogDescription>
            Моля, изберете причина за докладване на този сигнал.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Select onValueChange={setReportReason}>
            <SelectTrigger>
              <SelectValue placeholder="Причина за докладване" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Невярна информация">Невярна информация</SelectItem>
              <SelectItem value="Спам">Спам</SelectItem>
              <SelectItem value="Дублиран сигнал">Дублиран сигнал</SelectItem>
              <SelectItem value="Друго">Друго</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Отказ</AlertDialogCancel>
          <AlertDialogAction 
            disabled={!reportReason}
            onClick={handleReportSignal}
          >
            Докладвай
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportDialog;
