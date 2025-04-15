import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalsManagement from '@/components/admin/SignalsManagement';
import DangerousAreasManagement from '@/components/admin/dangerous-areas/DangerousAreasManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAllDangerousAreas } from '@/lib/api/dangerous-areas';
import { fetchAllSignals } from '@/lib/api/signals';

const Moderator = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Check if the user is a moderator or admin
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin';
  
  // Function to trigger refreshing of all data
  const handleRefresh = useCallback(() => {
    console.log("Triggering refresh in Moderator page, current key:", refreshKey);
    setRefreshKey(prev => prev + 1);
  }, [refreshKey]);
  
  // Fetch signals for moderators
  const { 
    data: signals = [], 
    isLoading: loadingSignals,
    refetch: refetchSignals
  } = useQuery({
    queryKey: ['moderator-signals', refreshKey],
    queryFn: async () => {
      if (!user || !isModerator) return [];
      
      try {
        // Get all signals using our dedicated function
        const signalsData = await fetchAllSignals();
        
        if (!signalsData || signalsData.length === 0) {
          return [];
        }
        
        // Process the data for display
        const enrichedSignals = signalsData.map(signal => {
          return {
            ...signal,
            user_full_name: signal.profiles?.full_name || 'Неизвестен',
            user_email: signal.profiles?.email || 'Неизвестен имейл'
          };
        });
        
        console.log("Successfully processed signals for moderator view:", enrichedSignals);
        return enrichedSignals;
      } catch (error) {
        console.error("Error fetching signals for moderator:", error);
        return [];
      }
    },
    enabled: !!user && isModerator
  });

  // If not logged in or not a moderator
  if (!user || !isModerator) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Достъпът отказан</h1>
            <p className="mb-6">Трябва да сте модератор, за да видите тази страница.</p>
            <Button onClick={() => navigate('/')}>Към началната страница</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Модераторски панел</h1>
          
          <Tabs defaultValue="signals" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="signals">Сигнали</TabsTrigger>
              <TabsTrigger value="dangerous-areas">Опасни участъци</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals">
              <SignalsManagement 
                signals={signals}
                loadingSignals={loadingSignals}
                onRefresh={refetchSignals}
              />
            </TabsContent>
            
            <TabsContent value="dangerous-areas">
              <DangerousAreasManagement 
                onRefresh={handleRefresh}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Moderator;
