
import React from 'react';
import ProfileHubButton from './ProfileHubButton';
import { LucideIcon } from 'lucide-react';

interface ButtonConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  dropdown?: { label: string; onClick: () => void }[];
}

interface DesktopProfilePanelProps {
  buttons: ButtonConfig[];
}

const DesktopProfilePanel: React.FC<DesktopProfilePanelProps> = ({ buttons }) => {
  return (
    <div className="fixed right-6 top-24 z-40 flex flex-col gap-2">
      {buttons.map((button) => (
        <ProfileHubButton 
          key={button.id}
          label={button.label}
          icon={button.icon}
          onClick={button.onClick}
          dropdown={button.dropdown}
        />
      ))}
    </div>
  );
};

export default DesktopProfilePanel;
