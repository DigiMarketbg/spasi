
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Users, ListChecks, MapPin, UserCheck, Eye } from "lucide-react";
import { ThumbsUp } from "lucide-react";
import { PawPrint } from "lucide-react";

interface AdminTabsListProps {
  unreadCount: number;
  pendingRequestsCount: number;
  pendingDangerousAreasCount: number;
  pendingGoodDeedsCount?: number;
  pendingVolunteersCount?: number;
  pendingWitnessesCount?: number;
}

const AdminTabsList = ({
  unreadCount,
  pendingRequestsCount,
  pendingDangerousAreasCount,
  pendingGoodDeedsCount = 0,
  pendingVolunteersCount = 0,
  pendingWitnessesCount = 0,
}: AdminTabsListProps) => {
  return (
    <div className="space-y-2 w-full">
      {/* First row */}
      <TabsList className="grid grid-cols-4 w-full"> 
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
      </TabsList>

      {/* Second row */}
      <TabsList className="grid grid-cols-5 w-full">
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
        <TabsTrigger value="volunteers" className="flex items-center gap-2">
          <span className="relative">
            <UserCheck className="h-4 w-4" />
            {pendingVolunteersCount > 0 && (
              <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full text-[10px] px-[4px]">
                {pendingVolunteersCount}
              </span>
            )}
          </span>
          <span className="hidden sm:inline">Доброволци</span>
        </TabsTrigger>
        <TabsTrigger value="witnesses" className="flex items-center gap-2">
          <span className="relative">
            <Eye className="h-4 w-4" />
            {pendingWitnessesCount > 0 && (
              <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full text-[10px] px-[4px]">
                {pendingWitnessesCount}
              </span>
            )}
          </span>
          <span className="hidden sm:inline">Свидетели</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminTabsList;
