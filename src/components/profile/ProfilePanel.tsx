
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileConfig } from '@/hooks/use-profile-config';
import { useNavigate } from 'react-router-dom';
import DesktopProfilePanel from './DesktopProfilePanel';

const ProfilePanel = () => {
  const { user, profile, isModerator, signOut } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { buttons, activeTab, setActiveTab } = useProfileConfig(isModerator);

  if (!user || isMobile) {
    return null;
  }

  // Desktop panel only
  return <DesktopProfilePanel buttons={buttons} />;
};

export default ProfilePanel;
