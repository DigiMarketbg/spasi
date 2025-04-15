
import { supabase } from "@/integrations/supabase/client";
import { Witness } from "@/types/witness";

// Fetch all approved witness posts
export const fetchApprovedWitnesses = async (): Promise<Witness[]> => {
  console.log("Fetching approved witnesses...");
  
  try {
    const now = new Date().toISOString();
    
    // Get all approved witness posts that haven't expired
    const { data, error } = await supabase
      .from("witnesses")
      .select("*")
      .eq("is_approved", true)
      .gte("expires_at", now)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching witnesses:", error);
      throw new Error("Error fetching witnesses");
    }

    console.log("Successfully fetched witness posts:", data);
    
    // Type cast to Witness[] as we know the structure matches
    return (data || []) as unknown as Witness[];
  } catch (error) {
    console.error("Error in fetchApprovedWitnesses:", error);
    throw new Error("Error fetching witness posts");
  }
};

// Get a single witness post by ID
export const getWitnessById = async (id: string): Promise<Witness> => {
  if (!id) {
    throw new Error("ID is required");
  }

  try {
    const { data, error } = await supabase
      .from("witnesses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching witness post:", error);
      throw new Error("Error fetching witness post details");
    }

    return data as unknown as Witness;
  } catch (error) {
    console.error("Error in getWitnessById:", error);
    throw new Error("Error fetching witness post details");
  }
};

// Submit a new witness post
export const submitWitness = async (witnessData: any, userId: string): Promise<string> => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  try {
    // Calculate expiry date (7 days from now)
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(now.getDate() + 7);
    
    const { data, error } = await supabase
      .from("witnesses")
      .insert({
        ...witnessData,
        user_id: userId,
        is_approved: false,
        created_at: now.toISOString(),
        expires_at: expiryDate.toISOString()
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error submitting witness post:", error);
      throw new Error(`Error submitting witness post: ${error.message}`);
    }
    
    console.log("Witness post submitted successfully:", data);
    return data.id;
  } catch (error: any) {
    console.error("Error in submitWitness:", error);
    throw new Error(error.message || "Error submitting witness post");
  }
};

// Delete a witness post by ID
export const deleteWitness = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("ID is required");
  }
  
  try {
    const { error } = await supabase
      .from("witnesses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting witness post:", error);
      throw new Error(`Error deleting witness post: ${error.message}`);
    }
    
    console.log("Witness post successfully deleted");
  } catch (error: any) {
    console.error("Error in deleteWitness:", error);
    throw new Error(error.message || "Error deleting witness post");
  }
};

// Update a witness post's approval status
export const updateWitnessStatus = async (
  id: string, 
  isApproved: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('witnesses')
      .update({ is_approved: isApproved })
      .eq('id', id);

    if (error) {
      console.error("Error updating witness status:", error);
      throw error;
    }
    
    console.log("Witness status updated successfully");
  } catch (error: any) {
    console.error("Error in updateWitnessStatus:", error);
    throw new Error(error.message || "Error updating witness status");
  }
};

// Fetch all witnesses for admin panel
export const fetchAllWitnesses = async (): Promise<Witness[]> => {
  console.log("Fetching all witnesses for admin...");
  
  try {
    const { data, error } = await supabase
      .from("witnesses")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching all witnesses:", error);
      throw new Error("Error fetching all witnesses");
    }

    return data as unknown as Witness[];
  } catch (error) {
    console.error("Error in fetchAllWitnesses:", error);
    throw new Error("Error fetching all witnesses");
  }
};
