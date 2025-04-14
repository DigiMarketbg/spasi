
import React, { useState, useEffect } from 'react';
import { Volunteer } from '@/types/volunteer';
import { getVolunteerRegistrations, registerForMission } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import WelcomeCard from './dashboard/WelcomeCard';
import MissionsList from './dashboard/MissionsList';
import InstructionsCard from './dashboard/InstructionsCard';

interface VolunteerDashboardProps {
  volunteer: Volunteer;
}

const VolunteerDashboard = ({ volunteer }: VolunteerDashboardProps) => {
  const { toast } = useToast();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const registrations = await getVolunteerRegistrations(volunteer.id);
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

    fetchMissions();
  }, [volunteer.id, toast]);

  const handleRegister = async (missionId: string) => {
    try {
      await registerForMission(missionId, volunteer.id);
      toast({
        title: "Успешно записване",
        description: "Успешно се записахте за мисията",
      });
      
      // Refresh missions
      const registrations = await getVolunteerRegistrations(volunteer.id);
      setMissions(registrations);
    } catch (error) {
      console.error('Error registering for mission:', error);
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Възникна проблем при записването за мисията"
      });
    }
  };

  return (
    <div className="space-y-8">
      <WelcomeCard volunteer={volunteer} />

      <div>
        <h3 className="text-xl font-semibold mb-4">Текущи мисии</h3>
        <MissionsList 
          missions={missions.length > 0 ? missions : [
            {
              mission: {
                id: 1,
                title: "Транспорт на хранителни продукти",
                location: "София - Младост 4",
                date: "21.04.2025",
                status: "active",
                category: "transport"
              },
              status: "pending"
            },
            {
              mission: {
                id: 2,
                title: "Помощ в пакетиране на дарения",
                location: "София - Люлин 5",
                date: "25.04.2025",
                status: "upcoming",
                category: "logistics"
              },
              status: null
            },
            {
              mission: {
                id: 3,
                title: "Доставка на храна до центрове",
                location: "София - Център",
                date: "18.04.2025",
                status: "completed",
                category: "food"
              },
              status: "completed"
            }
          ]}
          loading={loading}
          volunteer={volunteer}
          onRegister={handleRegister}
        />
      </div>

      <InstructionsCard />
    </div>
  );
};

export default VolunteerDashboard;
