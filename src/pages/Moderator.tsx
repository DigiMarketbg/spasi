
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalsManagement from '@/components/admin/SignalsManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const Moderator = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
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
      
      const { data, error } = await supabase
        .from('signals')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data to match the structure expected by SignalsManagement
      return data.map(signal => ({
        ...signal,
        user_full_name: signal.profiles?.full_name,
        user_email: signal.profiles?.email
      }));
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
          
          {/* Signal Management */}
          <SignalsManagement 
            signals={signals}
            loadingSignals={loadingSignals}
            onRefresh={refetchSignals}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Moderator;
