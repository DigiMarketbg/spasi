
import { supabase } from "@/integrations/supabase/client";
import type { TableName, QueryFilters } from "./types";
import { requireAuth } from "./auth";

/**
 * Secure data access functions - wrap supabase calls with error handling and auth checks
 */
export const secureDataAccess = {
  select: async <T = any>(
    table: TableName, 
    columns: string = '*', 
    query?: QueryFilters
  ): Promise<T[]> => {
    try {
      await requireAuth();
      
      // Start with base query
      const baseQuery = supabase
        .from(table)
        .select(columns);
      
      // Apply filters if provided - refactored to avoid deep type nesting
      if (!query || Object.keys(query).length === 0) {
        // No filters, execute the base query directly
        const { data, error } = await baseQuery;
        if (error) throw error;
        return (data || []) as T[];
      } else {
        // Apply filters manually in a way that avoids deep type nesting
        const filterEntries = Object.entries(query);
        let builder = baseQuery;
        
        // Apply all filters in a loop
        for (const [key, value] of filterEntries) {
          // Use type assertion to avoid TypeScript complaints
          builder = (builder as any).eq(key, value);
        }
        
        const { data, error } = await builder;
        if (error) throw error;
        return (data || []) as T[];
      }
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
