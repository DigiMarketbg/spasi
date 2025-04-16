
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  role?: "user" | "moderator" | "admin";
  onRefresh: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ userId, isAdmin, role, onRefresh }) => {
  const { toast } = useToast();
  const isModerator = role === 'moderator';

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

  const toggleModeratorStatus = async () => {
    // Use the actual role value from the 'role' column
    const newRole = isModerator ? 'user' : 'moderator';
    
    try {
      console.log(`Updating user ${userId} to role: ${newRole}`);
      
      // Update without trying to get the row back with single()
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        title: "Успешно",
        description: isModerator
          ? "Модераторските права на потребителя са премахнати."
          : "Потребителят е направен модератор.",
      });

      // Trigger refresh of users data
      onRefresh();
    } catch (error: any) {
      console.error('Error toggling moderator status:', error);
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на потребителя.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        size="sm" 
        variant={isAdmin ? "destructive" : "default"}
        onClick={toggleUserAdminStatus}
      >
        {isAdmin ? 'Премахни админ права' : 'Направи администратор'}
      </Button>
      
      <Button 
        size="sm" 
        variant={isModerator ? "destructive" : "secondary"}
        onClick={toggleModeratorStatus}
      >
        {isModerator ? 'Премахни модератор права' : 'Направи модератор'}
      </Button>
    </div>
  );
};

export default UserActions;
