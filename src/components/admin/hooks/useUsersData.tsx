
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean | null;
  role: "user" | "moderator" | "admin" | null;
}

export const useUsersData = (isEnabled: boolean) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    if (!isEnabled) return;

    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на потребителите.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, [isEnabled, toast]);

  return {
    users,
    loadingUsers,
    fetchUsers
  };
};
