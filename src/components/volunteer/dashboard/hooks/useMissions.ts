
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getVolunteerRegistrations, registerForMission } from '@/lib/api';

export const useMissions = (volunteerId: string) => {
  const { toast } = useToast();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const registrations = await getVolunteerRegistrations(volunteerId);
      setMissions(registrations);
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Възникна проблем при зареждането на мисиите"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (missionId: string) => {
    try {
      await registerForMission(missionId, volunteerId);
      toast({
        title: "Успешно записване",
        description: "Успешно се записахте за мисията",
      });
      
      // Refresh missions
      await fetchMissions();
    } catch (error) {
      console.error('Error registering for mission:', error);
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Възникна проблем при записването за мисията"
      });
    }
  };

  return {
    missions,
    loading,
    fetchMissions,
    handleRegister
  };
};
