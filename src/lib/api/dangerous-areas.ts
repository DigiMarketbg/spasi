
import { supabase } from "@/integrations/supabase/client";
import { DangerousArea } from "@/types/dangerous-area";

export const fetchDangerousAreas = async () => {
  const { data, error } = await supabase
    .from('dangerous_areas')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const addDangerousArea = async (areaData: Omit<DangerousArea, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('dangerous_areas')
    .insert([areaData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
