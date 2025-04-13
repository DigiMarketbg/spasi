
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import SignalsManagement from '@/components/admin/SignalsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signals, setSignals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Достъп забранен",
        description: "Нямате право да достъпвате тази страница.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate, toast]);

  // Fetch signals
  const fetchSignals = async () => {
    setLoadingSignals(true);
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*, profiles:user_id(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignals(data || []);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при зареждането на сигналите.",
        variant: "destructive",
      });
    } finally {
      setLoadingSignals(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при зареждането на потребителите.",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSignals();
      fetchUsers();
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Зареждане...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Администраторски панел</h1>
          
          <Button 
            onClick={() => navigate('/admin/volunteers')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Управление на доброволци
          </Button>
        </div>
        
        <Tabs defaultValue="signals">
          <TabsList className="mb-6">
            <TabsTrigger value="signals">Сигнали</TabsTrigger>
            <TabsTrigger value="users">Потребители</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals">
            <SignalsManagement 
              signals={signals} 
              loadingSignals={loadingSignals}
              onRefresh={fetchSignals}
            />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersManagement 
              users={users} 
              loadingUsers={loadingUsers}
              onRefresh={fetchUsers}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
