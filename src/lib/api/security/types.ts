
import type { Database } from "@/integrations/supabase/types";

// Table names type for type safety
export type TableName = keyof Database['public']['Tables'];

// Simple type definition for query filters
export type SimpleValue = string | number | boolean | null;
export interface QueryFilters {
  [key: string]: SimpleValue;
}
