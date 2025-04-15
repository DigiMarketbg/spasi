
import { supabase } from "@/integrations/supabase/client";
import { DangerousArea } from "@/types/dangerous-area";

export const fetchDangerousAreas = async (): Promise<DangerousArea[]> => {
  const { data, error } = await supabase
    .from('dangerous_areas')
    .select('*')
    .eq('is_approved', true) // Only fetch approved areas
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Cast the returned data to ensure correct typing
  return (data || []) as DangerousArea[];
};

export const fetchAllDangerousAreas = async (): Promise<DangerousArea[]> => {
  const { data, error } = await supabase
    .from('dangerous_areas')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Cast the returned data to ensure correct typing
  return (data || []) as DangerousArea[];
};

export const fetchPendingDangerousAreas = async (): Promise<DangerousArea[]> => {
  const { data, error } = await supabase
    .from('dangerous_areas')
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Cast the returned data to ensure correct typing
  return (data || []) as DangerousArea[];
};

export const addDangerousArea = async (areaData: Omit<DangerousArea, 'id' | 'created_at' | 'is_approved'>) => {
  const { data, error } = await supabase
    .from('dangerous_areas')
    .insert({
      ...areaData,
      is_approved: false // New areas start as unapproved
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as DangerousArea;
};

export const updateDangerousAreaApproval = async (id: string, isApproved: boolean): Promise<void> => {
  const { error } = await supabase
    .from('dangerous_areas')
    .update({ is_approved: isApproved })
    .eq('id', id);
    
  if (error) throw error;
};

export const deleteDangerousArea = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('dangerous_areas')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
