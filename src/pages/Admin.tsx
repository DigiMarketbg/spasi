
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignalsManagement from '@/components/admin/SignalsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import { BookOpen, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the interfaces for signals and users data
interface SignalData {
  id: string;
  title: string;
  category: string;
  city: string;
  created_at: string;
  is_approved: boolean;
  is_resolved: boolean;
  user_id: string;
  user_full_name?: string;
  user_email?: string;
}

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
  is_admin: boolean | null;
}

const Admin = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for signals and users
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch signals data with better error handling
  const fetchSignals = async () => {
    setLoadingSignals(true);
    try {
      console.log("Fetching signals...");
      
      // First, get all signals
      const { data: signalsData, error: signalsError } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false });

      if (signalsError) {
        console.error('Error fetching signals:', signalsError);
        throw signalsError;
      }
      
      console.log("Signals data received:", signalsData);
      
      if (!signalsData || signalsData.length === 0) {
        setSignals([]);
        setLoadingSignals(false);
        return;
      }
      
      // Then, get all profiles to join manually
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }
      
      console.log("Profiles data received:", profilesData);
      
      // Join the data manually
      const enrichedSignals = signalsData.map(signal => {
        const userProfile = profilesData?.find(profile => profile.id === signal.user_id);
        
        return {
          id: signal.id,
          title: signal.title,
          category: signal.category,
          city: signal.city,
          created_at: signal.created_at,
          is_approved: signal.is_approved,
          is_resolved: signal.is_resolved,
          user_id: signal.user_id,
          user_full_name: userProfile?.full_name || 'Неизвестен',
          user_email: userProfile?.email || 'Неизвестен имейл'
        };
      });
      
      setSignals(enrichedSignals);
    } catch (error: any) {
      console.error('Error fetching signals:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на сигналите: " + (error.message || error),
        variant: "destructive",
      });
      setSignals([]);
    } finally {
      setLoadingSignals(false);
    }
  };

  // Fetch users data
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
      console.error('Error fetching users:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на потребителите.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user && isAdmin) {
      fetchSignals();
      fetchUsers();
    }
  }, [user, isAdmin]);

  // If not logged in or not admin
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
          <h1 className="text-3xl font-bold mb-8">Административен панел</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/blog')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Блог статии</CardTitle>
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Управление на блог статии, публикуване и редактиране на съдържание.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/volunteers')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Доброволци</CardTitle>
                <Users className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Преглед и одобрение на заявки от доброволци.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Сигнали</CardTitle>
                <Bell className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Преглед и управление на всички подадени сигнали.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="signals">
            <TabsList>
              <TabsTrigger value="signals">Сигнали</TabsTrigger>
              <TabsTrigger value="users">Потребители</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на сигнали</CardTitle>
                  <CardDescription>
                    Преглед на всички сигнали в системата, одобрение и отбелязване като решени.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignalsManagement 
                    signals={signals} 
                    loadingSignals={loadingSignals} 
                    onRefresh={fetchSignals} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на потребители</CardTitle>
                  <CardDescription>
                    Преглед и управление на всички регистрирани потребители.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersManagement 
                    users={users} 
                    loadingUsers={loadingUsers} 
                    onRefresh={fetchUsers} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
