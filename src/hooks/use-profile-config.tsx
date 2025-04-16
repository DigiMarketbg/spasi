
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Flag, Check, Plus, Users } from 'lucide-react';

export function useProfileConfig(isModerator: boolean) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Define button configurations
  const buttons = [
    {
      id: 'profile',
      label: 'Профил',
      icon: User,
      onClick: () => setActiveTab('profile'),
    },
    {
      id: 'publish',
      label: 'Публикуване',
      icon: Plus,
      dropdown: [
        { 
          label: 'Сигнали', 
          onClick: () => {
            navigate('/submit-signal');
          }
        },
        { 
          label: 'Опасни места', 
          onClick: () => {
            navigate('/add-dangerous-area');
          }
        },
        { 
          label: 'Свидетели', 
          onClick: () => {
            navigate('/submit-witness');
          }
        },
      ]
    }
  ];

  // Add role-specific buttons
  if (isModerator) {
    buttons.push({
      id: 'approvals',
      label: 'Одобрения',
      icon: Check,
      onClick: () => navigate('/moderator'),
    });
  }

  return {
    buttons,
    activeTab,
    setActiveTab,
    navigate
  };
}
