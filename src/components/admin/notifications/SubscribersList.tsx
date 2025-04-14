
import React, { useEffect, useState } from 'react';
import { ArrowUpDown, Search, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Subscriber {
  id: string;
  player_id: string;
  city: string | null;
  category: string[] | null;
  created_at: string;
  user_id: string | null;
  user_email?: string | null;
  user_name?: string | null;
}

// Define the profiles type for proper type checking
interface Profile {
  email: string | null;
  full_name: string | null;
}

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<'created_at' | 'city'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      // Fetch subscribers
      const { data, error } = await supabase
        .from('push_subscribers')
        .select('*')
        .order(sortKey, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;
      
      // Fetch profiles separately to avoid join issues
      const formattedData: Subscriber[] = await Promise.all(data.map(async (sub) => {
        let userEmail = null;
        let userName = null;
        
        if (sub.user_id) {
          // Fetch the user profile for each subscriber that has a user_id
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', sub.user_id)
            .single();
            
          if (!profileError && profileData) {
            userEmail = profileData.email;
            userName = profileData.full_name;
          }
        }
        
        return {
          id: sub.id,
          player_id: sub.player_id,
          city: sub.city,
          category: sub.category,
          created_at: sub.created_at,
          user_id: sub.user_id,
          user_email: userEmail,
          user_name: userName
        };
      }));
      
      setSubscribers(formattedData);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при зареждането на абонатите',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [sortKey, sortDirection]);

  const handleSort = (key: 'created_at' | 'city') => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (sub.city && sub.city.toLowerCase().includes(searchLower)) ||
      (sub.user_email && sub.user_email.toLowerCase().includes(searchLower)) ||
      (sub.user_name && sub.user_name.toLowerCase().includes(searchLower)) ||
      (sub.category && sub.category.some(cat => cat.toLowerCase().includes(searchLower)))
    );
  });

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да премахнете този абонат?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('push_subscribers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      
      toast({
        title: 'Успешно премахнат абонат',
        description: 'Абонатът беше премахнат успешно',
      });
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при премахването на абоната',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Търсене по град, имейл или категория..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => fetchSubscribers()}
          disabled={loading}
        >
          Обнови
        </Button>
      </div>
      
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Зареждане...</p>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-muted-foreground">Няма намерени абонати</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Абонат</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="px-0 font-medium"
                    onClick={() => handleSort('city')}
                  >
                    Град
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Категории</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="px-0 font-medium"
                    onClick={() => handleSort('created_at')}
                  >
                    Дата на абониране
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    {subscriber.user_name ? (
                      <div>
                        <div>{subscriber.user_name}</div>
                        <div className="text-xs text-muted-foreground">{subscriber.user_email}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Анонимен потребител</span>
                    )}
                  </TableCell>
                  <TableCell>{subscriber.city || '-'}</TableCell>
                  <TableCell>
                    {subscriber.category?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {subscriber.category.map((cat, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(subscriber.created_at).toLocaleDateString('bg-BG')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteSubscriber(subscriber.id)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SubscribersList;
