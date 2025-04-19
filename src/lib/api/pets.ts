import { supabase } from "@/integrations/supabase/client";

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

// Fetch approved pet posts
export const fetchApprovedPetPosts = async (): Promise<PetPost[]> => {
  const { data, error } = await supabase
    .from("pet_posts")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as PetPost[];
};

// Fetch all pet posts (for admin)
export const fetchAllPetPosts = async (): Promise<PetPost[]> => {
  const { data, error } = await supabase
    .from("pet_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as PetPost[];
};

// Add a new pet post
export const addPetPost = async (
  userId: string,
  title: string,
  description: string,
  imageUrl?: string | null
): Promise<void> => {
  const { error } = await supabase.from("pet_posts").insert({
    user_id: userId,
    title,
    description,
    image_url: imageUrl || null,
    is_approved: false,
    status: "pending",
  });
  if (error) throw error;
};

// Approve a pet post by id (update is_approved and status)
export const approvePetPostById = async (id: string): Promise<void> => {
  if (!id) throw new Error("ID is required");

  const { error } = await supabase
    .from("pet_posts")
    .update({ 
      is_approved: true,
      status: "approved",
    })
    .eq("id", id);

  if (error) throw error;
};
