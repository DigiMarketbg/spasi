
import React, { useState } from 'react';
import { User, Shield, Flag, MapPin, Eye, Bell } from 'lucide-react';
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

interface MobileProfileDrawerProps {
  displayName: string;
  userEmail: string | undefined;
  fullName?: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isModerator: boolean;
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
  signOut,
  navigateToPath,
  triggerButton,
}) => {
  const [open, setOpen] = useState(false);
  
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="profile">Профил</TabsTrigger>
              <TabsTrigger value="actions">Действия</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <UserProfileCard email={userEmail} fullName={fullName} />
              
              {/* Moderator hub section - visible only to moderators */}
              {isModerator && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Модераторски достъп</h3>
                    <Badge variant="outline" className="ml-auto bg-primary/10 text-xs">Модератор</Badge>
                  </div>
                  
                  <HubButton 
                    icon={Shield}
                    label="Модераторски панел"
                    onClick={() => handleNavigateAndClose('/moderator')}
                    variant="primary"
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="actions">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <HubButton 
                  icon={Flag}
                  label="Подай сигнал"
                  onClick={() => handleNavigateAndClose('/submit-signal')}
                />
                
                <HubButton 
                  icon={MapPin}
                  label="Опасен участък"
                  onClick={() => handleNavigateAndClose('/add-dangerous-area')}
                />
                
                <HubButton 
                  icon={Eye}
                  label="Свидетел"
                  onClick={() => handleNavigateAndClose('/submit-witness')}
                />
                
                <HubButton 
                  icon={Bell}
                  label="Известия"
                  onClick={() => handleNavigateAndClose('/notifications')}
                />
              </div>
              
              {/* Moderator section - visible only to moderators */}
              {isModerator && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Модераторски достъп</h3>
                  </div>
                  
                  <HubButton 
                    icon={Shield}
                    label="Модераторски панел"
                    onClick={() => handleNavigateAndClose('/moderator')}
                    variant="primary"
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
