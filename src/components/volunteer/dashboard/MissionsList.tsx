
import React from 'react';
import MissionCard from './MissionCard';
import { Volunteer } from '@/types/volunteer';

interface MissionsListProps {
  missions: any[];
  loading: boolean;
  volunteer: Volunteer;
  onRegister: (missionId: string) => void;
}

const MissionsList = ({ missions, loading, volunteer, onRegister }: MissionsListProps) => {
  // Filter missions that match volunteer skills
  const relevantMissions = missions.filter(item => 
    volunteer.can_help_with.some(skill => 
      item.mission.category.includes(skill) || skill === 'other'
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Зареждане на мисии...</div>
      </div>
    );
  }

  if (relevantMissions.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Няма налични мисии, съответстващи на вашите умения в момента.</p>
        <p className="text-sm mt-2">Моля, проверете отново по-късно за нови възможности.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {relevantMissions.map((item, index) => (
        <MissionCard 
          key={index}
          mission={item.mission}
          status={item.status}
          onRegister={onRegister}
        />
      ))}
    </div>
  );
};

export default MissionsList;
