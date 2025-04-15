
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
  
  console.log("Fetched all dangerous areas:", data);
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
  console.log(`[updateDangerousAreaApproval] Starting approval update for ID ${id}, setting is_approved to ${isApproved}`);
  
  try {
    // Important change: Remove the .select() and .single() calls that cause the JSON object error
    const { error } = await supabase
      .from('dangerous_areas')
      .update({ is_approved: isApproved })
      .eq('id', id);
    
    if (error) {
      console.error("[updateDangerousAreaApproval] Error updating area:", error);
      throw error;
    }
    
    console.log("[updateDangerousAreaApproval] Update successful");
  } catch (error) {
    console.error("[updateDangerousAreaApproval] Exception caught:", error);
    throw error;
  }
};

export const deleteDangerousArea = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('dangerous_areas')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
