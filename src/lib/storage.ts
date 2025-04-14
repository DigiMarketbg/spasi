
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const ensureStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists
    console.log(`Checking if bucket '${bucketName}' exists...`);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      throw new Error(`Error checking buckets: ${listError.message}`);
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // Create bucket if it doesn't exist
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' does not exist, creating...`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }
      
      console.log(`Bucket ${bucketName} created successfully`);
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw new Error(`Failed to ensure bucket ${bucketName} exists: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const uploadFile = async (
  bucketName: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  try {
    console.log(`Starting upload process for file to bucket '${bucketName}'...`);
    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size} bytes`);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please upload only images';
      console.error(errorMsg);
      toast({ 
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'Maximum file size: 5MB';
      console.error(errorMsg);
      toast({ 
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
    
    // Ensure bucket exists
    await ensureStorageBucket(bucketName);
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    console.log(`Uploading file with generated name '${filePath}' to bucket '${bucketName}'...`);
    
    // Simulate progress if onProgress callback is provided
    let progressInterval: number | undefined;
    if (onProgress) {
      let progress = 0;
      progressInterval = window.setInterval(() => {
        progress += 5;
        if (progress < 95) {
          onProgress(progress);
        }
      }, 300);
    }
    
    // Upload file
    const { error, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite existing files with same name
        contentType: file.type // Explicitly set content type from file
      });
    
    // Clear progress interval
    if (progressInterval) {
      clearInterval(progressInterval);
      onProgress && onProgress(100); // Set to 100% when done
    }
    
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
