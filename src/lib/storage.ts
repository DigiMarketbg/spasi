
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const ensureStorageBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' does not exist.`);
      return false;
    } else {
      console.log(`Bucket '${bucketName}' exists.`);
      return true;
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
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
    
    // Check if bucket exists
    const bucketExists = await ensureStorageBucket(bucketName);
    if (!bucketExists) {
      // If bucket doesn't exist, we'll return null but not throw an error
      console.log(`Bucket '${bucketName}' doesn't exist, proceeding without image upload.`);
      toast({ 
        title: "Notice",
        description: "Image upload is currently unavailable. Your signal will be submitted without an image.",
        variant: "default"
      });
      return null;
    }
    
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
      toast({
        title: "Upload Failed",
        description: "Unable to upload image. Your signal will be submitted without an image.",
        variant: "default"
      });
      return null;
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
    toast({
      title: "Upload Failed",
      description: "Unable to upload image. Your signal will be submitted without an image.",
      variant: "default"
    });
    return null;
  }
};
