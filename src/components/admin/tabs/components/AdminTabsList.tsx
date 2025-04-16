
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <TabsList className={`${isMobile ? 'w-full grid grid-cols-3 h-auto flex-wrap gap-1 mb-4' : 'mb-4'}`}>
      <TabsTrigger 
        value="signals" 
        className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
      >
        Сигнали
      </TabsTrigger>
      <TabsTrigger 
        value="users" 
        className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
      >
        Потребители
      </TabsTrigger>
      <TabsTrigger 
        value="partners" 
        className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
      >
        Партньори
        {pendingRequestsCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-500 rounded-full">
            {pendingRequestsCount}
          </span>
        )}
      </TabsTrigger>
      <TabsTrigger 
        value="messages" 
        className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
      >
        Съобщения
        {unreadCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </TabsTrigger>
      <TabsTrigger 
        value="dangerous-areas" 
        className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
      >
        {isMobile ? 'Участъци' : 'Опасни участъци'}
        {pendingDangerousAreasCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-orange-500 rounded-full">
            {pendingDangerousAreasCount}
          </span>
        )}
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
