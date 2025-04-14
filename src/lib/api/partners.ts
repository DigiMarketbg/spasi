
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types/partner";

// Get all partners
export const getPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching partners:", error);
    throw new Error("Error fetching partners");
  }
};

// Add a new partner
export const addPartner = async (partner: Omit<Partner, 'id' | 'created_at'>): Promise<Partner> => {
  const { data, error } = await supabase
    .from("partners")
    .insert([partner])
    .select()
    .single();
    
  if (error) {
    console.error("Error adding partner:", error);
    throw new Error("Error adding partner");
  }
  
  return data as Partner;
};

// Update a partner
export const updatePartner = async (id: string, partner: Partial<Omit<Partner, 'id' | 'created_at'>>): Promise<void> => {
  const { error } = await supabase
    .from("partners")
    .update(partner)
    .eq("id", id);
    
  if (error) {
    console.error("Error updating partner:", error);
    throw new Error("Error updating partner");
  }
};

// Delete a partner
export const deletePartner = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("partners")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting partner:", error);
    throw new Error("Error deleting partner");
  }
};
