
import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfileConfig } from '@/hooks/use-profile-config';
import { useNavigate } from 'react-router-dom';
import DesktopProfilePanel from './DesktopProfilePanel';
import MobileProfileDrawer from './MobileProfileDrawer';

const ProfilePanel = () => {
  const { user, profile, isModerator, signOut } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { buttons, activeTab, setActiveTab } = useProfileConfig(isModerator);

  if (!user) {
    return null;
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Потребител';
  
  const handleNavigate = (path: string) => {
    // Close the drawer by updating the activeTab to profile
    setActiveTab('profile');
    // Navigate to the given path
    navigate(path);
  };
  
  // Mobile panel
  if (isMobile) {
    return (
      <MobileProfileDrawer
        displayName={displayName}
        userEmail={user.email}
        fullName={profile?.full_name}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isModerator={isModerator}
        signOut={signOut}
        navigateToPath={handleNavigate}
      />
    );
  }

  // Desktop panel
  return <DesktopProfilePanel buttons={buttons} />;
};

export default ProfilePanel;
