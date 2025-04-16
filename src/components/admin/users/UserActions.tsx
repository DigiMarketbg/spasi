
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  role?: "user" | "moderator" | "admin";
  onRefresh: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ userId, isAdmin, role, onRefresh }) => {
  const { toast: hookToast } = useToast();
  const isModerator = role === 'moderator';

  const toggleUserAdminStatus = async () => {
    try {
      console.log(`Toggling admin status for user ${userId}. Current status: ${isAdmin}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isAdmin })
        .eq('id', userId);

      if (error) throw error;

      toast.success(!isAdmin 
        ? "Потребителят е направен администратор." 
        : "Администраторските права на потребителя са премахнати."
      );

      // Trigger refresh of users data
      onRefresh();
    } catch (error: any) {
      console.error('Error toggling admin status:', error);
      toast.error("Възникна проблем при обновяването на потребителя.", {
        description: error.message
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
      
      toast.success(isModerator
        ? "Модераторските права на потребителя са премахнати."
        : "Потребителят е направен модератор."
      );

      // Trigger refresh of users data
      onRefresh();
    } catch (error: any) {
      console.error('Error toggling moderator status:', error);
      toast.error("Възникна проблем при обновяването на потребителя.", {
        description: error.message
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
