
import { supabase } from "@/integrations/supabase/client";

// Get approved volunteers grouped by city
export const getApprovedVolunteersByCity = async (): Promise<{[city: string]: {name: string, phone: string}[]}> => {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('full_name, phone, city')
      .eq('is_approved', true)
      .order('city');
      
    if (error) throw error;
    
    // Group volunteers by city
    const volunteersByCity = (data || []).reduce((acc, volunteer) => {
      if (!volunteer.city) return acc;
      
      if (!acc[volunteer.city]) {
        acc[volunteer.city] = [];
      }
      
      acc[volunteer.city].push({
        name: volunteer.full_name,
        phone: volunteer.phone || 'Не е предоставен'
      });
      
      return acc;
    }, {} as {[city: string]: {name: string, phone: string}[]});
    
    return volunteersByCity;
  } catch (error) {
    console.error("Error fetching volunteers by city:", error);
    throw new Error("Error fetching volunteers by city");
  }
};
