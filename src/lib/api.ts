
import { supabase } from "@/integrations/supabase/client";
import { Signal } from "@/types/signal";
import { uploadFile } from "./storage";

// Get a single signal by ID
export const getSignalById = async (id: string): Promise<Signal> => {
  if (!id) {
    throw new Error("ID is required");
  }

  const { data, error } = await supabase
    .from("signals")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching signal:", error);
    throw new Error("Error fetching signal details");
  }

  return data as Signal;
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

// Upload an image for a signal with improved error handling
export const uploadSignalImage = async (file: File): Promise<string | null> => {
  if (!file) {
    console.log("No file provided for upload");
    return null;
  }
  
  // Generate a unique filename to avoid collisions
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExt = file.name.split('.').pop();
  const fileName = `signal_${timestamp}_${randomString}.${fileExt}`;
  const filePath = fileName;
  
  console.log(`Attempting to upload file: ${fileName} of type ${file.type} and size ${file.size} bytes`);
  
  const imageUrl = await uploadFile('signals', filePath, file);
  
  if (!imageUrl) {
    console.error("Failed to upload image, null URL returned");
  } else {
    console.log("Image successfully uploaded:", imageUrl);
  }
  
  return imageUrl;
};
