import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Users, ListChecks, MapPin } from "lucide-react";

interface AdminTabsListProps {
  unreadCount: number;
  pendingRequestsCount: number;
  pendingDangerousAreasCount: number;
}

const AdminTabsList = ({ 
  unreadCount, 
  pendingRequestsCount,
  pendingDangerousAreasCount 
}: AdminTabsListProps) => {
  return (
    <TabsList className="grid grid-cols-6 w-full">
      <TabsTrigger value="signals" className="flex items-center gap-2">
        <ListChecks className="h-4 w-4" />
        <span className="hidden sm:inline">Сигнали</span>
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Потребители</span>
      </TabsTrigger>
      <TabsTrigger value="partners" className="flex items-center gap-2">
        <span className="relative">
          <Users className="h-4 w-4" />
          {pendingRequestsCount > 0 && (
            <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full text-[10px] px-[4px]">
              {pendingRequestsCount}
            </span>
          )}
        </span>
        <span className="hidden sm:inline">Партньори</span>
      </TabsTrigger>
      <TabsTrigger value="messages" className="flex items-center gap-2">
        <span className="relative">
          <Mail className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full text-[10px] px-[4px]">
              {unreadCount}
            </span>
          )}
        </span>
        <span className="hidden sm:inline">Съобщения</span>
      </TabsTrigger>
      <TabsTrigger value="dangerous-areas" className="flex items-center gap-2">
        <span className="relative">
          <MapPin className="h-4 w-4" />
            {pendingDangerousAreasCount > 0 && (
              <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full text-[10px] px-[4px]">
                {pendingDangerousAreasCount}
              </span>
            )}
        </span>
        <span className="hidden sm:inline">Опасни зони</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Известия</span>
      </TabsTrigger>
    </TabsList>
  )
}

export default AdminTabsList
