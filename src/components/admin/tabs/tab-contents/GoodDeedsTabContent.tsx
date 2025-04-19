
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { getPendingGoodDeeds, getGoodDeedsStats } from '@/lib/api/good-deeds';
import { toast } from '@/hooks/use-toast';

interface GoodDeed {
  id: string;
  description?: string;
  author_name?: string | null;
  created_at?: string;
}

const GoodDeedsTabContent = () => {
  const [pendingGoodDeeds, setPendingGoodDeeds] = useState<GoodDeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ total_count: number; today_count: number; pending_count: number }>({
    total_count: 0,
    today_count: 0,
    pending_count: 0,
  });

  const loadPendingGoodDeeds = async () => {
    try {
      setLoading(true);
      const [pending, statData] = await Promise.all([getPendingGoodDeeds(), getGoodDeedsStats()]);
      setPendingGoodDeeds(pending);
      setStats(statData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Грешка при зареждане',
        description: error instanceof Error ? error.message : 'Възникна грешка при зареждане на добрите дела',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingGoodDeeds();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      // Approve the good deed by setting is_approved = true
      // Use Supabase client directly here or add function in api/good-deeds.ts
      const { error } = await fetch('/api/admin/approve-good-deed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).then(res => res.json());
      if (error) throw new Error(error);
      toast({
        title: 'Одобрено',
        description: 'Доброто дело беше успешно одобрено.',
      });
      loadPendingGoodDeeds();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Грешка при одобрение',
        description: error instanceof Error ? error.message : 'Възникна грешка при одобрението',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Одобрение на добри дела (чакащи: {stats.pending_count})
        </h2>
      </div>
      {loading ? (
        <p>Зареждане...</p>
      ) : pendingGoodDeeds.length === 0 ? (
        <p>Няма чакащи добри дела за одобрение.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Описание</TableHead>
              <TableHead>Автор</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingGoodDeeds.map((deed) => (
              <TableRow key={deed.id}>
                <TableCell>{deed.description || '-'}</TableCell>
                <TableCell>{deed.author_name || 'Анонимен'}</TableCell>
                <TableCell>{deed.created_at ? new Date(deed.created_at).toLocaleDateString('bg-BG') : '-'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleApprove(deed.id)} size="sm" disabled={loading}>
                    Одобри
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default GoodDeedsTabContent;
