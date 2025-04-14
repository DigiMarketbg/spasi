
import { supabase } from "@/integrations/supabase/client";

export const ensureStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      console.log(`Bucket ${bucketName} created successfully`);
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
    // Ensure bucket exists
    const bucketReady = await ensureStorageBucket(bucketName);
    if (!bucketReady) {
      throw new Error(`Failed to ensure bucket ${bucketName} exists`);
    }
    
    // Upload file
    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    return null;
  }
};
