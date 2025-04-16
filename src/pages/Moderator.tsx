
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
import { Signal } from '@/types/signal';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import ErrorAlert from '@/components/signal-form/ErrorAlert';
import { useIsMobile } from '@/hooks/use-mobile';

const Moderator = () => {
  const {
    user,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Check if the user is a moderator or admin
  const isModerator = profile?.role === 'moderator' || profile?.role === 'admin';

  // Function to trigger refreshing of all data
  const handleRefresh = useCallback(() => {
    console.log("Triggering refresh in Moderator page, current key:", refreshKey);
    setRefreshKey(prev => prev + 1);
    setError(null); // Clear errors on refresh
  }, [refreshKey]);

  // Fetch signals for moderators
  const {
    data: signals = [],
    isLoading: loadingSignals,
    error: signalsError,
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
        const enrichedSignals = signalsData.map((signal: Signal) => {
          return {
            ...signal,
            user_full_name: signal.profiles?.full_name || 'Неизвестен',
            user_email: signal.profiles?.email || 'Неизвестен имейл'
          };
        });
        console.log("Successfully processed signals for moderator view:", enrichedSignals);
        return enrichedSignals;
      } catch (error: any) {
        console.error("Error fetching signals for moderator:", error);
        setError(`Грешка при зареждане на сигналите: ${error.message || error}`);
        return [];
      }
    },
    enabled: !!user && isModerator,
    meta: {
      onError: (err: any) => {
        setError(`Грешка при зареждане на сигналите: ${err.message || 'Неизвестна грешка'}`);
      }
    }
  });

  // Fetch dangerous areas for moderators
  const {
    data: dangerousAreas = [],
    isLoading: loadingDangerousAreas,
    error: dangerousAreasError,
    refetch: refetchDangerousAreas
  } = useQuery({
    queryKey: ['moderator-dangerous-areas', refreshKey],
    queryFn: async () => {
      if (!user || !isModerator) return [];
      try {
        // Get all dangerous areas
        return await fetchAllDangerousAreas();
      } catch (error: any) {
        console.error("Error fetching dangerous areas for moderator:", error);
        setError(`Грешка при зареждане на опасните участъци: ${error.message || error}`);
        return [];
      }
    },
    enabled: !!user && isModerator,
    meta: {
      onError: (err: any) => {
        setError(`Грешка при зареждане на опасните участъци: ${err.message || 'Неизвестна грешка'}`);
      }
    }
  });

  // Display toast for errors
  useEffect(() => {
    if (signalsError) {
      toast.error('Възникна проблем при зареждането на сигналите', {
        description: 'Моля, опитайте отново чрез бутона за обновяване'
      });
    }
    if (dangerousAreasError) {
      toast.error('Възникна проблем при зареждането на опасните участъци', {
        description: 'Моля, опитайте отново чрез бутона за обновяване'
      });
    }
  }, [signalsError, dangerousAreasError]);

  // If not logged in or not a moderator
  if (!user || !isModerator) {
    return <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Достъпът отказан</h1>
            <p className="mb-6">Трябва да сте модератор, за да видите тази страница.</p>
            <Button onClick={() => navigate('/')}>Към началната страница</Button>
          </div>
        </main>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Модераторски панел</h1>
          
          {error && <div className="mb-6">
              <ErrorAlert error={error} />
              <Button onClick={handleRefresh} variant="outline" className="mt-2">
                Опитай отново
              </Button>
            </div>}
          
          <Tabs defaultValue="signals" className="w-full">
            <TabsList className={`mb-6 ${isMobile ? 'w-full grid grid-cols-2 h-auto gap-1' : ''}`}>
              <TabsTrigger value="signals" className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}>
                Сигнали
              </TabsTrigger>
              <TabsTrigger value="dangerous-areas" className={isMobile ? 'py-2 text-xs truncate max-w-full whitespace-nowrap overflow-hidden' : ''}>
                Участъци
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals">
              <SignalsManagement signals={signals} loadingSignals={loadingSignals} onRefresh={refetchSignals} />
            </TabsContent>
            
            <TabsContent value="dangerous-areas">
              <DangerousAreasManagement areas={dangerousAreas} loading={loadingDangerousAreas} onRefresh={refetchDangerousAreas} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Moderator;
