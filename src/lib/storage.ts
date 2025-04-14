
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Instead of trying to create the bucket, we'll just check if it exists
export const ensureStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      throw new Error(`Error checking buckets: ${listError.message}`);
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' does not exist. It should be created from the Supabase dashboard.`);
      throw new Error(`Bucket ${bucketName} does not exist. Please contact the administrator.`);
    } else {
      console.log(`Bucket '${bucketName}' exists.`);
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
};

export const uploadFile = async (
  bucketName: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  try {
    console.log(`Starting upload process for file to bucket '${bucketName}'...`);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Please upload only image files (JPEG, PNG, GIF, WebP, SVG)';
      console.error(errorMsg);
      toast({ 
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
    
    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      const errorMsg = 'Maximum file size: 20MB';
      console.error(errorMsg);
      toast({ 
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
    
    // Check if bucket exists instead of trying to create it
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
        upsert: true,
        contentType: file.type
      });
    
    // Clear progress interval
    if (progressInterval) {
      clearInterval(progressInterval);
      onProgress && onProgress(100);
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
