
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
    // First, verify the area exists
    const { data: checkData, error: checkError } = await supabase
      .from('dangerous_areas')
      .select('id, is_approved')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error("[updateDangerousAreaApproval] Error checking area existence:", checkError);
      throw checkError;
    }
    
    console.log("[updateDangerousAreaApproval] Area current status:", checkData);
    
    // Now update the approval status
    const { data, error } = await supabase
      .from('dangerous_areas')
      .update({ is_approved: isApproved })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error("[updateDangerousAreaApproval] Error updating area:", error);
      throw error;
    }
    
    console.log("[updateDangerousAreaApproval] Update response:", data);
    
    // Verify the update was successful
    const { data: verifyData, error: verifyError } = await supabase
      .from('dangerous_areas')
      .select('id, is_approved')
      .eq('id', id)
      .single();
    
    if (verifyError) {
      console.error("[updateDangerousAreaApproval] Error verifying update:", verifyError);
      throw verifyError;
    }
    
    console.log("[updateDangerousAreaApproval] Post-update verification:", verifyData);
    
    if (verifyData.is_approved !== isApproved) {
      console.error("[updateDangerousAreaApproval] Update failed, status mismatch:", verifyData);
      throw new Error("Failed to update approval status");
    }
  } catch (error) {
    console.error("[updateDangerousAreaApproval] Exception occurred:", error);
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
