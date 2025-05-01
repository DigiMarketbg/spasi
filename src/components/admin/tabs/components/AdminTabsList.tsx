
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Users, ListChecks, MapPin } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { PawPrint } from "lucide-react";

interface AdminTabsListProps {
  unreadCount: number;
  pendingRequestsCount: number;
  pendingDangerousAreasCount: number;
  pendingGoodDeedsCount?: number;
}

const AdminTabsList = ({
  unreadCount,
  pendingRequestsCount,
  pendingDangerousAreasCount,
  pendingGoodDeedsCount = 0,
}: AdminTabsListProps) => {
  return (
    <TabsList className="grid grid-cols-8 w-full"> 
      <TabsTrigger value="signals" className="flex items-center gap-2">
        <ListChecks className="h-4 w-4" />
        <span className="hidden sm:inline">Сигнали</span>
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Потребители</span>
      </TabsTrigger>
      <TabsTrigger value="partners" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Партньори</span>
      </TabsTrigger>
      <TabsTrigger value="messages" className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Съобщения</span>
      </TabsTrigger>
      <TabsTrigger value="dangerous-areas" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">Опасни зони</span>
      </TabsTrigger>
      <TabsTrigger value="good-deeds" className="flex items-center gap-2">
        <span className="relative">
          <ThumbsUp className="h-4 w-4" />
          {pendingGoodDeedsCount > 0 && (
            <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full text-[10px] px-[4px]">
              {pendingGoodDeedsCount}
            </span>
          )}
        </span>
        <span className="hidden sm:inline">Добри дела</span>
      </TabsTrigger>
      <TabsTrigger value="pets" className="flex items-center gap-2">
        <PawPrint className="h-4 w-4" />
        <span className="hidden sm:inline">Домашни любимци</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Известия</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
