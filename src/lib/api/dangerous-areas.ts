
import { supabase } from "@/integrations/supabase/client";
import { DangerousArea } from "@/types/dangerous-area";

export const fetchDangerousAreas = async (): Promise<DangerousArea[]> => {
  try {
    const { data, error } = await supabase
      .from('dangerous_areas')
      .select('*')
      .eq('is_approved', true) // Only fetch approved areas
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching approved dangerous areas:", error);
      throw error;
    }
    
    return (data || []) as DangerousArea[];
  } catch (error) {
    console.error("Error in fetchDangerousAreas:", error);
    throw new Error("Error fetching dangerous areas");
  }
};

export const fetchAllDangerousAreas = async (): Promise<DangerousArea[]> => {
  try {
    const { data, error } = await supabase
      .from('dangerous_areas')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching all dangerous areas:", error);
      throw error;
    }
    
    console.log("Fetched all dangerous areas:", data);
    return (data || []) as DangerousArea[];
  } catch (error) {
    console.error("Error in fetchAllDangerousAreas:", error);
    throw new Error("Error fetching all dangerous areas");
  }
};

export const fetchPendingDangerousAreas = async (): Promise<DangerousArea[]> => {
  try {
    const { data, error } = await supabase
      .from('dangerous_areas')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching pending dangerous areas:", error);
      throw error;
    }
    
    return (data || []) as DangerousArea[];
  } catch (error) {
    console.error("Error in fetchPendingDangerousAreas:", error);
    throw new Error("Error fetching pending dangerous areas");
  }
};

export const addDangerousArea = async (areaData: Omit<DangerousArea, 'id' | 'created_at' | 'is_approved'>) => {
  try {
    const { data, error } = await supabase
      .from('dangerous_areas')
      .insert({
        ...areaData,
        is_approved: false // New areas start as unapproved
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error adding dangerous area:", error);
      throw error;
    }
    
    return data as DangerousArea;
  } catch (error) {
    console.error("Error in addDangerousArea:", error);
    throw new Error("Error adding dangerous area");
  }
};

export const updateDangerousAreaApproval = async (id: string, isApproved: boolean): Promise<void> => {
  console.log(`[updateDangerousAreaApproval] Starting approval update for ID ${id}, setting is_approved to ${isApproved}`);
  
  try {
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
    console.error("Error in updateDangerousAreaApproval:", error);
    throw new Error(`Error updating dangerous area: ${error}`);
  }
};

export const deleteDangerousArea = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('dangerous_areas')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting dangerous area:", error);
      throw error;
    }
    
    console.log("Dangerous area successfully deleted");
  } catch (error) {
    console.error("Error in deleteDangerousArea:", error);
    throw new Error(`Error deleting dangerous area: ${error}`);
  }
};
