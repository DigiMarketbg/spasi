// Explicitly type parameters for addGoodDeed for clarity and to fix TS errors
import { supabase } from "@/integrations/supabase/client";

export const getGoodDeedsStats = async () => {
  const { data, error } = await supabase.rpc('get_good_deeds_stats');
  if (error) throw error;
  return data[0];
};

export const addGoodDeed = async (
  description?: string, 
  authorName?: string, 
  title?: string
): Promise<void> => {
  const response = await fetch('https://api.ipify.org?format=json');
  const { ip } = await response.json();

  const { data: canAdd, error: checkError } = await supabase
    .rpc('can_add_good_deed', { client_ip: ip });

  if (checkError) throw checkError;
  if (!canAdd) throw new Error('Вече сте регистрирали 3 добри дела за днес!');

  const { error } = await supabase
    .from('good_deeds')
    .insert([{ 
      ip_address: ip, 
      description,
      author_name: authorName === undefined ? 'Анонимен' : authorName,
      title,
    }]);

  if (error) throw error;
};

export const getApprovedGoodDeeds = async () => {
  const { data, error } = await supabase
    .from('good_deeds')
    .select('id, description, author_name, created_at, title')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getPendingGoodDeeds = async () => {
  const { data, error } = await supabase
    .from('good_deeds')
    .select('id, description, author_name, created_at')
    .is('is_approved', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Approve a good deed by id
export const approveGoodDeedById = async (id: string): Promise<void> => {
  if (!id) throw new Error("ID е задължителен");

  const { error } = await supabase
    .from("good_deeds")
    .update({ is_approved: true })
    .eq("id", id);

  if (error) throw error;
};
