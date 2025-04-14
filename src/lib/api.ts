import { supabase } from "@/integrations/supabase/client";
import { Signal } from "@/types/signal";
import { uploadFile } from "./storage";
import { toast } from "@/hooks/use-toast";

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

// Upload an image for a signal with improved error handling and progress tracking
export const uploadSignalImage = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  if (!file) {
    console.log("No file provided for upload");
    return null;
  }
  
  try {
    // All validation now happens in the uploadFile function
    console.log(`Preparing to upload file: ${file.name} of type ${file.type} and size ${file.size} bytes`);
    
    // Use the improved uploadFile function
    const imageUrl = await uploadFile('signals', file, onProgress);
    
    if (imageUrl) {
      console.log("Image successfully uploaded:", imageUrl);
    } else {
      console.log("No image URL returned, continuing without image");
    }
    
    return imageUrl;
  } catch (error: any) {
    console.error("Error in uploadSignalImage:", error);
    
    // Show a toast notification for the error
    toast({
      variant: "default",
      title: "Сигналът ще бъде изпратен без изображение",
      description: "Не можахме да качим изображението, но сигналът ви все още ще бъде подаден."
    });
    
    return null;
  }
};
