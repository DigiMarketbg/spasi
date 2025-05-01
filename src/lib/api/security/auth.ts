
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user has admin privileges
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: profile } = await supabase.auth.getSession();
    if (!profile.session || !profile.session.user) {
      return false;
    }
    
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', profile.session.user.id)
      .single();
    
    return data?.is_admin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Check if current user is moderator or higher
 */
export const isCurrentUserModerator = async (): Promise<boolean> => {
  try {
    const { data: profile } = await supabase.auth.getSession();
    if (!profile.session || !profile.session.user) {
      return false;
    }
    
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', profile.session.user.id)
      .single();
    
    return data?.role === 'moderator' || data?.role === 'admin';
  } catch (error) {
    console.error('Error checking moderator status:', error);
    return false;
  }
};

/**
 * Helper to enforce authentication in client-side code
 */
export const requireAuth = async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw new Error("Authentication required");
  }
  return data.session;
};

/**
 * Get the current user ID safely
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id || null;
};
