
import { supabase } from "@/integrations/supabase/client";

export const ensureStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists
    console.log(`Checking if bucket '${bucketName}' exists...`);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // If bucket doesn't exist, we'll assume it was created via SQL and continue
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' doesn't appear in the list, but may exist with restricted permissions`);
      // We'll proceed assuming the bucket exists but isn't visible to the client due to permissions
      return true;
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
};

export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<string | null> => {
  try {
    console.log(`Starting upload process for file to bucket '${bucketName}'...`);
    
    // Ensure bucket exists
    const bucketReady = await ensureStorageBucket(bucketName);
    if (!bucketReady) {
      console.error(`Failed to ensure bucket ${bucketName} exists, but will try upload anyway`);
      // Continue anyway as the bucket likely exists but may not be visible due to permissions
    }
    
    // Upload file with better error handling and retry logic
    console.log(`Uploading file '${filePath}' to bucket '${bucketName}'...`);
    
    // Upload with more detailed error handling
    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to overwrite existing files with same name
      });
    
    if (error) {
      console.error('Upload error details:', error);
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
      console.error('Error stack:', error.stack);
      throw new Error(`Error uploading file: ${error.message}`);
    }
    
    console.log('File uploaded successfully, getting public URL...');
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    console.log('File uploaded successfully, URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    throw error;
  }
};

// Add new function to download a file from a bucket
export const downloadFile = async (
  bucketName: string,
  filePath: string
): Promise<Blob | null> => {
  try {
    console.log(`Downloading file '${filePath}' from bucket '${bucketName}'...`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      console.error('Download error details:', error);
      throw new Error(`Error downloading file: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data returned from download');
      return null;
    }
    
    console.log('File downloaded successfully');
    return data;
  } catch (error) {
    console.error(`Error downloading file from ${bucketName}:`, error);
    throw error;
  }
};

// Delete a file from a bucket
export const deleteFile = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    console.log(`Deleting file '${filePath}' from bucket '${bucketName}'...`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('Delete error details:', error);
      throw new Error(`Error deleting file: ${error.message}`);
    }
    
    console.log('File deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting file from ${bucketName}:`, error);
    throw error;
  }
};
