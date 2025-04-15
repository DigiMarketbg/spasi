
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalsManagement from '@/components/admin/SignalsManagement';
import DangerousAreasManagement from '@/components/admin/DangerousAreasManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchAllDangerousAreas } from '@/lib/api/dangerous-areas';

const Moderator = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [refreshDangerousAreas, setRefreshDangerousAreas] = useState(0);
  
  // Check if the user is a moderator or admin
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin';
  
  // Fetch signals for moderators
  const { 
    data: signals = [], 
    isLoading: loadingSignals,
    refetch: refetchSignals
  } = useQuery({
    queryKey: ['moderator-signals'],
    queryFn: async () => {
      if (!user || !isModerator) return [];
      
      // First, get all signals
      const { data: signalsData, error: signalsError } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (signalsError) throw signalsError;
      
      if (!signalsData || signalsData.length === 0) {
        return [];
      }
      
      // Then, get all profiles to join manually
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email');
        
      if (profilesError) throw profilesError;
      
      // Join the data manually
      const enrichedSignals = signalsData.map(signal => {
        const userProfile = profilesData?.find(profile => profile.id === signal.user_id);
        
        return {
          ...signal,
          user_full_name: userProfile?.full_name || 'Неизвестен',
          user_email: userProfile?.email || 'Неизвестен имейл'
        };
      });
      
      return enrichedSignals;
    },
    enabled: !!user && isModerator
  });

  // Function to trigger refreshing of dangerous areas
  const handleRefreshDangerousAreas = () => {
    console.log("Triggering refresh of dangerous areas");
    setRefreshDangerousAreas(prev => prev + 1);
  };

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
                onRefresh={handleRefreshDangerousAreas}
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
