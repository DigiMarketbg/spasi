
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  role: "user" | "moderator" | "admin" | null;
  onRefresh: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ userId, isAdmin, role, onRefresh }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isModerator = role === 'moderator';

  const toggleUserAdminStatus = async () => {
    try {
      if (!user) throw new Error("You must be logged in to perform this action");

      const { data, error } = await supabase
        .rpc('admin_update_user_role', {
          admin_id: user.id,
          target_user_id: userId,
          new_role: isAdmin ? 'user' : 'admin'
        });

      if (error) throw error;
      
      if (!data) {
        throw new Error("Failed to update user admin status. You may not have permission.");
      }

      toast({
        title: "Успешно",
        description: !isAdmin 
          ? "Потребителят е направен администратор." 
          : "Администраторските права на потребителя са премахнати.",
      });

      // Trigger refresh of users data
      onRefresh();
    } catch (error: any) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на потребителя.",
        variant: "destructive",
      });
    }
  };

  const toggleModeratorStatus = async () => {
    const newRole = isModerator ? 'user' : 'moderator';
    
    try {
      if (!user) throw new Error("You must be logged in to perform this action");

      const { data, error } = await supabase
        .rpc('admin_update_user_role', {
          admin_id: user.id,
          target_user_id: userId,
          new_role: newRole
        });
      
      if (error) throw error;
      
      if (!data) {
        throw new Error("Failed to update user role. You may not have permission.");
      }

      toast({
        title: "Успешно",
        description: isModerator
          ? "Модераторските права на потребителя са премахнати."
          : "Потребителят е направен модератор.",
      });

      // Trigger refresh of users data
      onRefresh();
    } catch (error: any) {
      console.error("Error updating moderator status:", error);
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
