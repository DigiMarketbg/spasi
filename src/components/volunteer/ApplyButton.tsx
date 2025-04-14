
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import VolunteerForm from '@/components/volunteer/VolunteerForm';

interface ApplyButtonProps {
  onSuccess: () => void;
}

const ApplyButton = ({ onSuccess }: ApplyButtonProps) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {!showForm ? (
        <Button 
          onClick={() => setShowForm(true)}
          size="lg" 
          className="animate-pulse bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
        >
          <UserPlus className="mr-2" />
          Стани доброволец
        </Button>
      ) : (
        <div className="glass p-6 md:p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Кандидатствай за доброволец</h2>
          <VolunteerForm onSuccess={onSuccess} />
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Отказ
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyButton;
