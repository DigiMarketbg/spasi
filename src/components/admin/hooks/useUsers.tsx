
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserData } from './types';

export const useUsers = (isAdmin: boolean, user: any) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch users data with improved error handling
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      console.log("Fetching all user profiles...");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user profiles:', error);
        throw error;
      }
      
      console.log("Fetched user profiles:", data?.length || 0);
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на потребителите: " + (error.message || error),
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  return {
    users,
    loadingUsers,
    fetchUsers
  };
};
