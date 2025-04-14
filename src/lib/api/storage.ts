
import { supabase } from "@/integrations/supabase/client";

// Upload an image for a signal with improved error handling
export const uploadSignalImage = async (file: File): Promise<string | null> => {
  if (!file) {
    console.log("No file provided for upload");
    return null;
  }
  
  try {
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
      throw new Error("Image upload failed");
    } else {
      console.log("Image successfully uploaded:", imageUrl);
    }
    
    return imageUrl;
  } catch (error) {
    console.error("Error in uploadSignalImage:", error);
    throw new Error("Неуспешно качване на изображението. Моля, опитайте отново.");
  }
};

// General file upload function
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading to ${bucketName}:`, error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Failed to upload file to ${bucketName}:`, error);
    return null;
  }
};
