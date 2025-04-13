
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volunteer } from '@/types/volunteer';
import VolunteerForm from '@/components/volunteer/VolunteerForm';
import VolunteerDashboard from '@/components/volunteer/VolunteerDashboard';
import PendingStatus from '@/components/volunteer/PendingStatus';

const Volunteers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('apply');

  useEffect(() => {
    const fetchVolunteerRecord = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('volunteers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setVolunteer(data as Volunteer);
          setActiveTab('dashboard');
        } else {
          setVolunteer(null);
          setActiveTab('apply');
        }
      } catch (error: any) {
        console.error('Error fetching volunteer record:', error.message);
        toast({
          variant: "destructive",
          title: "Грешка",
          description: "Възникна проблем при зареждането на информацията"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerRecord();
  }, [user, toast]);

  const handleFormSuccess = async () => {
    // Reload volunteer data after submission
    if (!user) return;
    
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching volunteer record:', error.message);
      return;
    }
    
    if (data) {
      setVolunteer(data as Volunteer);
      setActiveTab('dashboard');
    }
  };

  // If the user is not logged in, redirect to auth page
  useEffect(() => {
    if (user === null && !loading) {
      toast({
        title: "Необходим е вход",
        description: "За да станете доброволец, трябва първо да влезете в акаунта си.",
        variant: "default",
      });
      navigate('/auth?redirect=/volunteers');
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow mt-20 container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="animate-pulse">Зареждане...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Доброволци</h1>
          
          <div className="glass p-6 md:p-8 rounded-xl">
            {!volunteer ? (
              // Show application form if user has no volunteer record
              <>
                <p className="text-muted-foreground mb-6 text-center">
                  Стани част от екипа ни от доброволци и помогни на хората в нужда. 
                  Попълни формата по-долу, за да кандидатстваш.
                </p>
                <VolunteerForm onSuccess={handleFormSuccess} />
              </>
            ) : (
              // Show dashboard or pending status based on approval status
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="dashboard">Начало</TabsTrigger>
                  <TabsTrigger value="profile">Моят профил</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard">
                  {volunteer.is_approved ? (
                    <VolunteerDashboard volunteer={volunteer} />
                  ) : (
                    <PendingStatus />
                  )}
                </TabsContent>
                
                <TabsContent value="profile">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Моят профил</h2>
                    <p className="text-muted-foreground mb-4">
                      Тук можете да актуализирате информацията за своя доброволчески профил.
                    </p>
                    <VolunteerForm 
                      existingData={{
                        full_name: volunteer.full_name,
                        email: volunteer.email,
                        phone: volunteer.phone || '',
                        city: volunteer.city,
                        can_help_with: volunteer.can_help_with,
                        motivation: volunteer.motivation || '',
                      }} 
                      onSuccess={handleFormSuccess} 
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Volunteers;
