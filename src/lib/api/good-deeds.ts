
import { supabase } from "@/integrations/supabase/client";

export const getGoodDeedsStats = async () => {
  const { data, error } = await supabase.rpc('get_good_deeds_stats');
  if (error) throw error;
  return data[0];
};

export const addGoodDeed = async (description?: string, authorName?: string, title?: string) => {
  const response = await fetch('https://api.ipify.org?format=json');
  const { ip } = await response.json();

  // Call the can_add_good_deed RPC; it returns true or false wrapped in an array or object
  const { data, error: checkError } = await supabase
    .rpc('can_add_good_deed', { client_ip: ip });
  
  if (checkError) throw checkError;
  
  // The data might come wrapped; handle different formats:
  // It can be boolean directly or an array like [true] or [{can_add_good_deed: true}]
  let canAdd = false;

  if (typeof data === "boolean") {
    canAdd = data;
  } else if (Array.isArray(data)) {
    if (data.length === 0) {
      canAdd = false;
    } else if (typeof data[0] === "boolean") {
      canAdd = data[0];
    } else if (typeof data[0] === "object" && data[0] !== null) {
      if ('can_add_good_deed' in data[0]) {
        canAdd = data[0].can_add_good_deed;
      } else {
        canAdd = false;
      }
    } else {
      canAdd = false;
    }
  } else {
    canAdd = false;
  }

  if (!canAdd) throw new Error('Вече сте регистрирали 3 добри дела за днес!');

  // Insert the good deed
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
