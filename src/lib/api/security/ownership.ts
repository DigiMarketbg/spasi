
import { supabase } from "@/integrations/supabase/client";
import type { TableName } from "./types";

/**
 * Check if a specific record belongs to the current user
 */
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
