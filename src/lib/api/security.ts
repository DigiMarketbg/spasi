
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Table names type for type safety
type TableName = keyof Database['public']['Tables'];

// Check if the current user has admin privileges
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

// Check if current user is moderator or higher
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

// Check if a specific record belongs to the current user
export const isRecordOwner = async (
  table: TableName, 
  recordId: string,
  userIdField: string = 'user_id'
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session || !session.session.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from(table)
      .select(userIdField)
      .eq('id', recordId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data[userIdField] === session.session.user.id;
  } catch (error) {
    console.error(`Error checking ownership for ${table}:`, error);
    return false;
  }
};

// Helper to enforce authentication in client-side code
export const requireAuth = async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw new Error("Authentication required");
  }
  return data.session;
};

// Secure data access function - wraps supabase calls with error handling and auth checks
export const secureDataAccess = {
  select: async (
    table: TableName, 
    columns: string = '*', 
    query?: Record<string, any>
  ): Promise<any[]> => {
    try {
      await requireAuth();
      let request = supabase.from(table).select(columns);
      
      if (query) {
        request = Object.entries(query).reduce((req, [key, value]) => {
          return req.eq(key, value);
        }, request);
      }
      
      const { data, error } = await request;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error accessing ${table}:`, error);
      throw error;
    }
  },
  
  insert: async (
    table: TableName, 
    data: Record<string, unknown>, 
    options: { withUserId?: boolean } = {}
  ) => {
    try {
      const session = await requireAuth();
      const dataToInsert = { ...data } as any;
      
      if (options.withUserId) {
        dataToInsert.user_id = session.user.id;
      }
      
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert(dataToInsert)
        .select();
      
      if (error) throw error;
      return insertedData;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  },
  
  update: async (
    table: TableName, 
    id: string, 
    data: Record<string, unknown>
  ) => {
    try {
      await requireAuth();
      
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(data as any)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return updatedData;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  },
  
  delete: async (table: TableName, id: string) => {
    try {
      await requireAuth();
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }
};
