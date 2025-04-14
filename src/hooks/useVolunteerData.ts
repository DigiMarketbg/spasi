
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Volunteer } from '@/types/volunteer';
import { getApprovedVolunteersByCity } from '@/lib/api';

interface UseVolunteerDataProps {
  userId: string | undefined;
}

export const useVolunteerData = ({ userId }: UseVolunteerDataProps) => {
  const { toast } = useToast();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [volunteersByCity, setVolunteersByCity] = useState<{[city: string]: {name: string, phone: string}[]}>({});
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  // Fetch volunteer record for the current user
  useEffect(() => {
    const fetchVolunteerRecord = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('volunteers')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setVolunteer(data as Volunteer);
        } else {
          setVolunteer(null);
        }
      } catch (error: any) {
        console.error('Error fetching volunteer record:', error.message);
        toast({
          variant: "destructive",
          title: "Грешка",
          description: "Възникна проблем при зареждането на информацията"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerRecord();
  }, [userId, toast]);

  // Fetch approved volunteers by city
  useEffect(() => {
    const fetchVolunteersByCity = async () => {
      try {
        setLoadingVolunteers(true);
        const data = await getApprovedVolunteersByCity();
        setVolunteersByCity(data);
      } catch (error) {
        console.error('Error fetching volunteers by city:', error);
      } finally {
        setLoadingVolunteers(false);
      }
    };

    fetchVolunteersByCity();
  }, []);

  // Handle form submission success
  const handleFormSuccess = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching volunteer record:', error.message);
      return;
    }
    
    if (data) {
      setVolunteer(data as Volunteer);
    }
  };

  return {
    volunteer,
    loading,
    volunteersByCity,
    loadingVolunteers,
    handleFormSuccess
  };
};
