
import { supabase } from "@/integrations/supabase/client";
import { secureDataAccess, isCurrentUserAdmin } from "./security";

export interface PetPost {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url?: string | null;
  created_at: string;
  is_approved: boolean;
  status: string;
}

// Fetch approved pet posts - public function, no auth required
export const fetchApprovedPetPosts = async (): Promise<PetPost[]> => {
  const { data, error } = await supabase
    .from("pet_posts")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as PetPost[];
};

// Fetch all pet posts (for admin) - secure version
export const fetchAllPetPosts = async (): Promise<PetPost[]> => {
  try {
    const data = await secureDataAccess.select("pet_posts");
    return data as PetPost[];
  } catch (error) {
    console.error("Error fetching all pet posts:", error);
    throw error;
  }
};

// Add a new pet post - secure version with automatic user_id
export const addPetPost = async (
  title: string,
  description: string,
  imageUrl?: string | null
): Promise<void> => {
  try {
    await secureDataAccess.insert(
      "pet_posts", 
      {
        title,
        description,
        image_url: imageUrl || null,
        is_approved: false,
        status: "pending",
      },
      { withUserId: true }
    );
  } catch (error) {
    console.error("Error adding pet post:", error);
    throw error;
  }
};

// Approve a pet post by id (update is_approved and status) - secure admin function
export const approvePetPostById = async (id: string): Promise<void> => {
  if (!id) throw new Error("ID is required");

  try {
    // Check if user is admin first
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new Error("Only admins can approve pet posts");
    }
    
    await secureDataAccess.update("pet_posts", id, { 
      is_approved: true,
      status: "approved",
    });
  } catch (error) {
    console.error("Error approving pet post:", error);
    throw error;
  }
};

// Delete a pet post by id - secure admin function
export const deletePetPostById = async (id: string): Promise<void> => {
  if (!id) throw new Error("ID is required");

  try {
    // Check if user is admin first
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      throw new Error("Only admins can delete pet posts");
    }
    
    const success = await secureDataAccess.delete("pet_posts", id);
    if (!success) {
      throw new Error("Failed to delete pet post");
    }
  } catch (error) {
    console.error("Error deleting pet post:", error);
    throw error;
  }
};

// Removed the duplicate import at the bottom
