
import React, { useState } from 'react';
import { User, Shield, Flag, MapPin, Eye, Bell, Settings } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileCard } from './UserProfileCard';
import HubButton from './HubButton';
import { Badge } from '@/components/ui/badge';
import { MobileActionButtons } from './MobileActionButtons';

interface MobileProfileDrawerProps {
  displayName: string;
  userEmail: string | undefined;
  fullName?: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isModerator: boolean;
  isAdmin?: boolean;
  signOut: () => Promise<void>;
  navigateToPath: (path: string) => void;
  triggerButton?: React.ReactNode;
}

const MobileProfileDrawer: React.FC<MobileProfileDrawerProps> = ({
  displayName,
  userEmail,
  fullName,
  activeTab,
  setActiveTab,
  isModerator,
  isAdmin = false,
  signOut,
  navigateToPath,
  triggerButton,
}) => {
  const [open, setOpen] = useState(false);
  const [localActiveTab, setLocalActiveTab] = useState<string>(activeTab || 'profile');
  
  // Create a handler that will both navigate and close the drawer
  const handleNavigateAndClose = (path: string) => {
    // Close the drawer by using DrawerClose ref
    const closeButton = document.querySelector('[data-drawer-close="true"]') as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
    
    // Navigate after a short delay to ensure drawer closes first
    setTimeout(() => {
      navigateToPath(path);
    }, 150);
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setLocalActiveTab(tab);
    setActiveTab(tab);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="icon" className="rounded-full fixed bottom-20 right-4 z-50 bg-card shadow-lg">
            <User className="h-5 w-5" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="min-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Здравей, {displayName}!</DrawerTitle>
          <DrawerDescription>
            Управлявай своя профил и дейности
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4">
          <Tabs value={localActiveTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="profile">Профил</TabsTrigger>
              <TabsTrigger value="actions">Действия</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <UserProfileCard email={userEmail} fullName={fullName} />
              
              {/* Admin/Moderator hub section */}
              {(isModerator || isAdmin) && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">
                      {isAdmin ? 'Администраторски достъп' : 'Модераторски достъп'}
                    </h3>
                    <Badge variant="outline" className="ml-auto bg-primary/10 text-xs">
                      {isAdmin ? 'Админ' : 'Модератор'}
                    </Badge>
                  </div>
                  
                  {isAdmin && (
                    <HubButton 
                      icon={Settings}
                      label="Админ панел"
                      onClick={() => handleNavigateAndClose('/admin')}
                      variant="primary"
                    />
                  )}
                  
                  <HubButton 
                    icon={Shield}
                    label="Модераторски панел"
                    onClick={() => handleNavigateAndClose('/moderator')}
                    variant={isAdmin ? 'default' : 'primary'}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <MobileActionButtons 
                  isModerator={isModerator} 
                  navigateToPath={handleNavigateAndClose} 
                />
              </div>
              
              {/* Admin/Moderator section */}
              {(isModerator || isAdmin) && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">
                      {isAdmin ? 'Администраторски достъп' : 'Модераторски достъп'}
                    </h3>
                  </div>
                  
                  {isAdmin && (
                    <HubButton 
                      icon={Settings}
                      label="Админ панел"
                      onClick={() => handleNavigateAndClose('/admin')}
                      variant="primary"
                    />
                  )}
                  
                  <HubButton 
                    icon={Shield}
                    label="Модераторски панел"
                    onClick={() => handleNavigateAndClose('/moderator')}
                    variant={isAdmin ? 'default' : 'primary'}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={async () => {
              await signOut();
              handleNavigateAndClose('/');
            }}
          >
            Изход
          </Button>
          <DrawerClose asChild data-drawer-close="true">
            <Button variant="outline">Затвори</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileProfileDrawer;
