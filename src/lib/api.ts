import { supabase } from "@/integrations/supabase/client";
import { Signal } from "@/types/signal";
import { Video } from "@/types/video"; 
import { uploadFile } from "./storage";
import { Partner } from "@/types/partner";
import { VolunteerMission } from "@/types/volunteer";

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

// Video-related functions

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

// Partner-related functions

// Get all partners
export const getPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching partners:", error);
    throw new Error("Error fetching partners");
  }
};

// Add a new partner
export const addPartner = async (partner: Omit<Partner, 'id' | 'created_at'>): Promise<Partner> => {
  const { data, error } = await supabase
    .from("partners")
    .insert([partner])
    .select()
    .single();
    
  if (error) {
    console.error("Error adding partner:", error);
    throw new Error("Error adding partner");
  }
  
  return data as Partner;
};

// Update a partner
export const updatePartner = async (id: string, partner: Partial<Omit<Partner, 'id' | 'created_at'>>): Promise<void> => {
  const { error } = await supabase
    .from("partners")
    .update(partner)
    .eq("id", id);
    
  if (error) {
    console.error("Error updating partner:", error);
    throw new Error("Error updating partner");
  }
};

// Delete a partner
export const deletePartner = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("partners")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting partner:", error);
    throw new Error("Error deleting partner");
  }
};

// Volunteer missions related functions

// Get all volunteer missions
export const getVolunteerMissions = async (volunteerId?: string, limit?: number): Promise<VolunteerMission[]> => {
  try {
    let query = supabase
      .from("volunteer_missions")
      .select("*")
      .order("date", { ascending: true });
    
    if (volunteerId) {
      query = query.eq("volunteer_id", volunteerId);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching volunteer missions:", error);
    throw new Error("Error fetching volunteer missions");
  }
};

// Get a single mission by ID
export const getVolunteerMissionById = async (id: string): Promise<VolunteerMission> => {
  if (!id) {
    throw new Error("ID is required");
  }

  const { data, error } = await supabase
    .from("volunteer_missions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching volunteer mission:", error);
    throw new Error("Error fetching volunteer mission details");
  }

  return data as VolunteerMission;
};

// Add a new volunteer mission
export const addVolunteerMission = async (mission: Omit<VolunteerMission, 'id' | 'created_at'>): Promise<VolunteerMission> => {
  const { data, error } = await supabase
    .from("volunteer_missions")
    .insert([mission])
    .select()
    .single();
    
  if (error) {
    console.error("Error adding volunteer mission:", error);
    throw new Error("Error adding volunteer mission");
  }
  
  return data as VolunteerMission;
};

// Update a volunteer mission
export const updateVolunteerMission = async (id: string, mission: Partial<Omit<VolunteerMission, 'id' | 'created_at'>>): Promise<void> => {
  const { error } = await supabase
    .from("volunteer_missions")
    .update(mission)
    .eq("id", id);
    
  if (error) {
    console.error("Error updating volunteer mission:", error);
    throw new Error("Error updating volunteer mission");
  }
};

// Delete a volunteer mission
export const deleteVolunteerMission = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("volunteer_missions")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting volunteer mission:", error);
    throw new Error("Error deleting volunteer mission");
  }
};

// Register a volunteer for a mission
export const registerForMission = async (missionId: string, volunteerId: string): Promise<void> => {
  const { error } = await supabase
    .from("volunteer_mission_registrations")
    .insert([{ 
      mission_id: missionId, 
      volunteer_id: volunteerId,
      status: 'pending' 
    }]);
    
  if (error) {
    console.error("Error registering for mission:", error);
    throw new Error("Error registering for mission");
  }
};

// Update registration status
export const updateRegistrationStatus = async (
  missionId: string, 
  volunteerId: string, 
  status: 'pending' | 'approved' | 'rejected' | 'completed'
): Promise<void> => {
  const { error } = await supabase
    .from("volunteer_mission_registrations")
    .update({ status })
    .match({ mission_id: missionId, volunteer_id: volunteerId });
    
  if (error) {
    console.error("Error updating registration status:", error);
    throw new Error("Error updating registration status");
  }
};

// Get a volunteer's mission registrations
export const getVolunteerRegistrations = async (volunteerId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from("volunteer_mission_registrations")
    .select(`
      *,
      mission:mission_id(*)
    `)
    .eq("volunteer_id", volunteerId);
    
  if (error) {
    console.error("Error fetching volunteer registrations:", error);
    throw new Error("Error fetching volunteer registrations");
  }
  
  return data || [];
};
