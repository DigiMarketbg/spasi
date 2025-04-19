
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import SignalsTabContent from '@/components/admin/tabs/tab-contents/SignalsTabContent';
import DangerousAreasTabContent from '@/components/admin/tabs/tab-contents/DangerousAreasTabContent';
import GoodDeedsTabContent from '@/components/admin/tabs/tab-contents/GoodDeedsTabContent';
import PetsTabContent from '@/components/admin/tabs/components/PetsTabContent';

interface ModeratorTabsProps {
  signals: any[];
  loadingSignals: boolean;
  loadingDangerousAreas: boolean;
  refetchSignals: () => void;
  refetchDangerousAreas: () => void;
}

const ModeratorTabs = ({
  signals,
  loadingSignals,
  loadingDangerousAreas,
  refetchSignals,
  refetchDangerousAreas
}: ModeratorTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="signals" className="w-full">
      <TabsList className={`mb-6 ${isMobile ? 'w-full grid grid-cols-2 h-auto gap-1' : ''}`}>
        <TabsTrigger 
          value="signals" 
          className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
        >
          Сигнали
        </TabsTrigger>
        <TabsTrigger 
          value="dangerous-areas" 
          className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
        >
          Участъци
        </TabsTrigger>
        <TabsTrigger
          value="good-deeds"
          className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
        >
          Добри дела
        </TabsTrigger>
        <TabsTrigger
          value="pets"
          className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}
        >
          Домашни любимци
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signals">
        <SignalsTabContent 
          signals={signals} 
          loadingSignals={loadingSignals} 
          onRefresh={refetchSignals} 
        />
      </TabsContent>
      
      <TabsContent value="dangerous-areas">
        <DangerousAreasTabContent 
          onRefresh={refetchDangerousAreas} 
          loading={loadingDangerousAreas}
          pendingCount={0} 
        />
      </TabsContent>

      <TabsContent value="good-deeds">
        <GoodDeedsTabContent />
      </TabsContent>

      <TabsContent value="pets">
        <PetsTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default ModeratorTabs;
