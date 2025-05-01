
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Users, 
  Handshake, 
  MessageSquare, 
  MapPin, 
  Heart,
  Cat,
  Bell,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminTabsListProps {
  pendingRequestsCount?: number;
  unreadMessagesCount?: number;
  pendingGoodDeedsCount?: number;
}

const AdminTabsList: React.FC<AdminTabsListProps> = ({
  pendingRequestsCount = 0,
  unreadMessagesCount = 0,
  pendingGoodDeedsCount = 0
}) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:flex">
      <TabsTrigger value="signals" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span className="hidden sm:inline">Сигнали</span>
      </TabsTrigger>

      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Потребители</span>
      </TabsTrigger>

      <TabsTrigger value="partners" className="flex items-center gap-2">
        <Handshake className="h-4 w-4" />
        <span className="hidden sm:inline">Партньори</span>
        {pendingRequestsCount > 0 && (
          <Badge variant="destructive" className="ml-1 px-1 text-xs">
            {pendingRequestsCount}
          </Badge>
        )}
      </TabsTrigger>

      <TabsTrigger value="messages" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Съобщения</span>
        {unreadMessagesCount > 0 && (
          <Badge variant="destructive" className="ml-1 px-1 text-xs">
            {unreadMessagesCount}
          </Badge>
        )}
      </TabsTrigger>

      <TabsTrigger value="dangerous-areas" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Опасни зони</span>
      </TabsTrigger>

      <TabsTrigger value="good-deeds" className="flex items-center gap-2">
        <Heart className="h-4 w-4" />
        <span className="hidden sm:inline">Добри дела</span>
        {pendingGoodDeedsCount > 0 && (
          <Badge variant="destructive" className="ml-1 px-1 text-xs">
            {pendingGoodDeedsCount}
          </Badge>
        )}
      </TabsTrigger>

      <TabsTrigger value="pets" className="flex items-center gap-2">
        <Cat className="h-4 w-4" />
        <span className="hidden sm:inline">Домашни любимци</span>
      </TabsTrigger>
      
      <TabsTrigger value="witnesses" className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span className="hidden sm:inline">Свидетели</span>
      </TabsTrigger>

      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Известия</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
