
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MessageSquare, Bell, Flag, MapPin, Eye, 
  Check, Users, Plus, Menu, X
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileHubButton from './ProfileHubButton';
import ContactAdminForm from './ContactAdminForm';

const ProfilePanel = () => {
  const { user, profile, isModerator, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState('profile');

  if (!user) {
    return null;
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Потребител';
  
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
        { label: 'Сигнали', onClick: () => navigate('/submit-signal') },
        { label: 'Опасни места', onClick: () => navigate('/add-dangerous-area') },
        { label: 'Свидетели', onClick: () => navigate('/submit-witness') },
      ]
    },
    {
      id: 'messages',
      label: 'Съобщения',
      icon: MessageSquare,
      onClick: () => setActiveTab('messages'),
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
  
  // Check if the user is a volunteer
  const isVolunteer = !!profile?.is_volunteer;
  
  if (isVolunteer) {
    buttons.push({
      id: 'volunteers',
      label: 'Доброволци',
      icon: Users,
      onClick: () => navigate('/volunteers'),
    });
  }

  // Mobile drawer content
  const mobilePanel = (
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
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="profile">Профил</TabsTrigger>
              <TabsTrigger value="messages">Съобщения</TabsTrigger>
              <TabsTrigger value="actions">Действия</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Информация за профила</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Имейл:</strong> {user.email}</p>
                    {profile?.full_name && <p><strong>Име:</strong> {profile.full_name}</p>}
                    {profile?.city && <p><strong>Град:</strong> {profile.city}</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-4">
              <ContactAdminForm />
            </TabsContent>
            
            <TabsContent value="actions" className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/submit-signal')}
                className="flex flex-col items-center justify-center h-24 text-center"
              >
                <Flag className="h-6 w-6 mb-2" />
                <span>Подай сигнал</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/add-dangerous-area')}
                className="flex flex-col items-center justify-center h-24 text-center"
              >
                <MapPin className="h-6 w-6 mb-2" />
                <span>Опасен участък</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/submit-witness')}
                className="flex flex-col items-center justify-center h-24 text-center"
              >
                <Eye className="h-6 w-6 mb-2" />
                <span>Свидетел</span>
              </Button>
              
              {isModerator && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/moderator')}
                  className="flex flex-col items-center justify-center h-24 text-center"
                >
                  <Check className="h-6 w-6 mb-2" />
                  <span>Одобрения</span>
                </Button>
              )}
              
              {isVolunteer && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/volunteers')}
                  className="flex flex-col items-center justify-center h-24 text-center"
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>Доброволци</span>
                </Button>
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
              navigate('/');
            }}
          >
            Изход
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Затвори</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  // Desktop panel
  const desktopPanel = (
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

  return isMobile ? mobilePanel : desktopPanel;
};

export default ProfilePanel;
