
import { supabase } from "@/integrations/supabase/client";
import { Signal } from "@/types/signal";

// Get all signals with proper sorting
export const fetchAllSignals = async (): Promise<Signal[]> => {
  console.log("Fetching all signals...");
  
  try {
    // Just get all signals without trying to join with profiles
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching signals:", error);
      throw new Error("Error fetching signals");
    }

    console.log("Successfully fetched signals:", data);
    
    // Ensure all signals have a profiles property, even if empty
    const processedData = data.map(signal => {
      const processedSignal: Signal = {
        ...signal,
        profiles: { full_name: null, email: null }
      };
      return processedSignal;
    });
    
    return processedData;
  } catch (error) {
    console.error("Error in fetchAllSignals:", error);
    throw new Error("Error fetching signals");
  }
};

// Get a single signal by ID
export const getSignalById = async (id: string): Promise<Signal> => {
  if (!id) {
    throw new Error("ID is required");
  }

  try {
    // Just get the signal by ID without joining
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching signal:", error);
      throw new Error("Error fetching signal details");
    }

    // Handle profiles property safely with type checking
    const processedSignal: Signal = {
      ...data,
      // Ensure profiles is always a valid object with our expected structure
      profiles: { full_name: null, email: null }
    };

    return processedSignal;
  } catch (error) {
    console.error("Error in getSignalById:", error);
    throw new Error("Error fetching signal details");
  }
};

// Delete a signal by ID
export const deleteSignal = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("ID is required");
  }
  
  console.log("Attempting to delete signal with ID:", id);
  
  // First, delete any reports associated with this signal
  const { error: reportsError } = await supabase
    .from("reports")
    .delete()
    .eq("signal_id", id);
    
  if (reportsError) {
    console.error("Error deleting signal reports:", reportsError);
    // Continue with signal deletion even if report deletion fails
  }

  // Then delete the signal
  const { error } = await supabase
    .from("signals")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting signal:", error);
    throw new Error(`Error deleting signal: ${error.message}`);
  }
  
  console.log("Signal successfully deleted");
};

// Update a signal's status
export const updateSignalStatus = async (
  id: string, 
  newStatus: 'approved' | 'rejected'
): Promise<void> => {
  console.log(`Updating signal ${id} to status ${newStatus}`);
  
  const { error } = await supabase
    .from('signals')
    .update({ 
      status: newStatus, 
      is_approved: newStatus === 'approved' 
    })
    .eq('id', id);

  if (error) {
    console.error("Error updating signal status:", error);
    throw error;
  }
  
  console.log("Signal status updated successfully");
};
