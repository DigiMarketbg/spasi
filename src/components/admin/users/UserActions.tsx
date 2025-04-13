
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  onRefresh: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ userId, isAdmin, onRefresh }) => {
  const { toast } = useToast();

  const toggleUserAdminStatus = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isAdmin })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !isAdmin 
          ? "Потребителят е направен администратор." 
          : "Администраторските права на потребителя са премахнати.",
      });

      // Trigger refresh of users data
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на потребителя.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      size="sm" 
      variant={isAdmin ? "destructive" : "default"}
      onClick={toggleUserAdminStatus}
    >
      {isAdmin ? 'Премахни админ права' : 'Направи администратор'}
    </Button>
  );
};

export default UserActions;
