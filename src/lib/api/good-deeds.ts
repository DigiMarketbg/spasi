
import { supabase } from "@/integrations/supabase/client";

export const getGoodDeedsStats = async () => {
  const { data, error } = await supabase.rpc('get_good_deeds_stats');
  if (error) throw error;
  return data[0];
};

export const addGoodDeed = async (description?: string, authorName?: string, title?: string) => {
  const response = await fetch('https://api.ipify.org?format=json');
  const { ip } = await response.json();

  // Check if user can add a good deed today using policy
  const { data: canAdd, error: checkError } = await supabase
    .rpc('can_add_good_deed', { client_ip: ip });
    
  if (checkError) throw checkError;
  if (!canAdd) throw new Error('Вече сте регистрирали 3 добри дела за днес!');
  
  // Add the good deed
  const { error } = await supabase
    .from('good_deeds')
    .insert([{ 
      ip_address: ip, 
      description,
      author_name: authorName === undefined ? 'Анонимен' : authorName,
      title 
    }]);
    
  if (error) throw error;
};
