
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

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

// Simple type definition for query filters
type SimpleValue = string | number | boolean | null;
interface QueryFilters {
  [key: string]: SimpleValue;
}

// Secure data access function - wraps supabase calls with error handling and auth checks
export const secureDataAccess = {
  select: async <T = any>(
    table: TableName, 
    columns: string = '*', 
    query?: QueryFilters
  ): Promise<T[]> => {
    try {
      await requireAuth();
      
      // Build the query with filters directly
      let queryResult;
      
      if (!query) {
        // No filters, just run a simple select
        queryResult = await supabase
          .from(table)
          .select(columns);
      } else {
        // With filters, build the query step by step 
        // without reassigning the query builder variable
        const baseQuery = supabase
          .from(table)
          .select(columns);
          
        // Create an array of filter conditions
        const filters = Object.entries(query);
        
        if (filters.length === 0) {
          // No filters, execute the base query
          queryResult = await baseQuery;
        } else {
          // Apply first filter
          const [firstKey, firstValue] = filters[0];
          let filteredQuery = baseQuery.eq(firstKey, firstValue);
          
          // Apply any remaining filters sequentially
          for (let i = 1; i < filters.length; i++) {
            const [key, value] = filters[i];
            // Use explicit any type to avoid deep inference issues
            filteredQuery = (filteredQuery as any).eq(key, value);
          }
          
          // Execute the query
          queryResult = await filteredQuery;
        }
      }
      
      const { data, error } = queryResult;
      if (error) throw error;
      
      return (data || []) as T[];
    } catch (error) {
      console.error(`Error accessing ${table}:`, error);
      throw error;
    }
  },
  
  insert: async <T = any>(
    table: TableName, 
    data: Record<string, unknown>, 
    options: { withUserId?: boolean } = {}
  ): Promise<T> => {
    try {
      const session = await requireAuth();
      const dataToInsert = { ...data };
      
      if (options.withUserId) {
        dataToInsert.user_id = session.user.id;
      }
      
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert(dataToInsert as any)
        .select();
      
      if (error) throw error;
      return insertedData as unknown as T;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  },
  
  update: async <T = any>(
    table: TableName, 
    id: string, 
    data: Record<string, unknown>
  ): Promise<T> => {
    try {
      await requireAuth();
      
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(data as any)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return updatedData as unknown as T;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  },
  
  delete: async (table: TableName, id: string): Promise<boolean> => {
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
