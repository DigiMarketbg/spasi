
import React from 'react';
import { Volunteer } from '@/types/volunteer';
import MissionsList from './MissionsList';

interface MissionsSectionProps {
  missions: any[];
  loading: boolean;
  volunteer: Volunteer;
  onRegister: (missionId: string) => void;
}

const MissionsSection = ({ missions, loading, volunteer, onRegister }: MissionsSectionProps) => {
  return (
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
        onRegister={onRegister}
      />
    </div>
  );
};

export default MissionsSection;
