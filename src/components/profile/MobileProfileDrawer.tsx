
import React from 'react';
import { User } from 'lucide-react';
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
import { MobileActionButtons } from './MobileActionButtons';

interface MobileProfileDrawerProps {
  displayName: string;
  userEmail: string | undefined;
  fullName?: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isModerator: boolean;
  signOut: () => Promise<void>;
  navigateToPath: (path: string) => void;
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
}) => {
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
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full fixed bottom-20 right-4 z-50 bg-card shadow-lg">
          <User className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="min-h-[65vh]">
        <DrawerHeader>
          <DrawerTitle>Здравей, {displayName}!</DrawerTitle>
          <DrawerDescription>
            Управлявай своя профил и дейности
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="profile">Профил</TabsTrigger>
              <TabsTrigger value="actions">Действия</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <UserProfileCard email={userEmail} fullName={fullName} />
            </TabsContent>
            
            <TabsContent value="actions">
              <div className="grid grid-cols-2 gap-2">
                <MobileActionButtons 
                  isModerator={isModerator}
                  navigateToPath={handleNavigateAndClose}
                />
              </div>
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
