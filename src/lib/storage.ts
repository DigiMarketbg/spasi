
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
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' does not exist, creating...`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024 // Increasing to 10MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      console.log(`Bucket ${bucketName} created successfully`);
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
      console.error(`Failed to ensure bucket ${bucketName} exists`);
      throw new Error(`Failed to ensure bucket ${bucketName} exists`);
    }
    
    // Upload file with better error handling
    console.log(`Uploading file '${filePath}' to bucket '${bucketName}'...`);
    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to overwrite existing files with same name
      });
    
    if (error) {
      console.error('Upload error details:', error);
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
