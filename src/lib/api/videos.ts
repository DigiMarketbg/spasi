
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video";

// Get all videos
export const getVideos = async (limit?: number, publishedOnly = false): Promise<Video[]> => {
  try {
    let query = supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (publishedOnly) {
      query = query.eq("is_published", true);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Error fetching videos");
  }
};

// Get a single video by ID
export const getVideoById = async (id: string): Promise<Video> => {
  if (!id) {
    throw new Error("ID is required");
  }

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching video:", error);
    throw new Error("Error fetching video details");
  }

  return data as Video;
};

// Add a new video
export const addVideo = async (video: Omit<Video, 'id' | 'created_at'>): Promise<Video> => {
  const { data, error } = await supabase
    .from("videos")
    .insert([video])
    .select()
    .single();
    
  if (error) {
    console.error("Error adding video:", error);
    throw new Error("Error adding video");
  }
  
  return data as Video;
};

// Update a video
export const updateVideo = async (id: string, video: Partial<Omit<Video, 'id' | 'created_at'>>): Promise<void> => {
  const { error } = await supabase
    .from("videos")
    .update(video)
    .eq("id", id);
    
  if (error) {
    console.error("Error updating video:", error);
    throw new Error("Error updating video");
  }
};

// Delete a video
export const deleteVideo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("videos")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting video:", error);
    throw new Error("Error deleting video");
  }
};
