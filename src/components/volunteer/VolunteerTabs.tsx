
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VolunteerDashboard from '@/components/volunteer/VolunteerDashboard';
import VolunteerForm from '@/components/volunteer/VolunteerForm';
import PendingStatus from '@/components/volunteer/PendingStatus';
import { Volunteer } from '@/types/volunteer';

interface VolunteerTabsProps {
  volunteer: Volunteer;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onFormSuccess: () => void;
}

const VolunteerTabs = ({ volunteer, activeTab, setActiveTab, onFormSuccess }: VolunteerTabsProps) => {
  return (
    <div className="glass p-6 md:p-8 rounded-xl mb-10">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="dashboard">Начало</TabsTrigger>
          <TabsTrigger value="profile">Моят профил</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          {volunteer.is_approved ? (
            <VolunteerDashboard volunteer={volunteer} />
          ) : (
            <PendingStatus />
          )}
        </TabsContent>
        
        <TabsContent value="profile">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Моят профил</h2>
            <p className="text-muted-foreground mb-4">
              Тук можете да актуализирате информацията за своя доброволчески профил.
            </p>
            <VolunteerForm 
              existingData={{
                full_name: volunteer.full_name,
                email: volunteer.email,
                phone: volunteer.phone || '',
                city: volunteer.city,
                can_help_with: volunteer.can_help_with,
                motivation: volunteer.motivation || '',
              }} 
              onSuccess={onFormSuccess} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerTabs;
