
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RescuersManagement from '@/components/admin/RescuersManagement';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const AdminRescuers = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { 
    data: rescuers = [], 
    isLoading: loadingRescuers,
    refetch: refetchRescuers
  } = useQuery({
    queryKey: ['admin-rescuers'],
    queryFn: async () => {
      if (!user || !isAdmin) return [];
      
      const { data, error } = await supabase
        .from('rescuers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && isAdmin
  });

  // Ако потребителят не е влязъл или не е админ
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Достъпът отказан</h1>
            <p className="mb-6">Трябва да сте администратор, за да видите тази страница.</p>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Управление на спасители</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              Назад към админ панела
            </Button>
          </div>
          
          <RescuersManagement 
            rescuers={rescuers}
            loadingRescuers={loadingRescuers}
            onRefresh={refetchRescuers}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminRescuers;
