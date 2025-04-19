
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
  
  // Fix TS errors by typing data as any or unknown then narrow down with guards
  let canAdd: boolean = false;
  const resData: unknown = data;

  if (typeof resData === "boolean") {
    canAdd = resData;
  } else if (Array.isArray(resData)) {
    if (resData.length === 0) {
      canAdd = false;
    } else {
      const first = resData[0];
      if (typeof first === "boolean") {
        canAdd = first;
      } else if (typeof first === "object" && first !== null) {
        if ("can_add_good_deed" in first && typeof (first as any).can_add_good_deed === "boolean") {
          canAdd = (first as any).can_add_good_deed;
        } else {
          canAdd = false;
        }
      } else {
        canAdd = false;
      }
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
