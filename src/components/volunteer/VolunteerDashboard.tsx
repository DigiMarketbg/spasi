
import React, { useEffect } from 'react';
import { Volunteer } from '@/types/volunteer';
import WelcomeCard from './dashboard/WelcomeCard';
import MissionsSection from './dashboard/MissionsSection';
import InstructionsCard from './dashboard/InstructionsCard';
import { useMissions } from './dashboard/hooks/useMissions';

interface VolunteerDashboardProps {
  volunteer: Volunteer;
}

const VolunteerDashboard = ({ volunteer }: VolunteerDashboardProps) => {
  const { missions, loading, fetchMissions, handleRegister } = useMissions(volunteer.id);

  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <div className="space-y-8">
      <WelcomeCard volunteer={volunteer} />
      <MissionsSection 
        missions={missions} 
        loading={loading} 
        volunteer={volunteer} 
        onRegister={handleRegister} 
      />
      <InstructionsCard />
    </div>
  );
};

export default VolunteerDashboard;
