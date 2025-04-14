
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, UserPlus, Phone } from 'lucide-react';
import { Volunteer } from '@/types/volunteer';
import VolunteerForm from '@/components/volunteer/VolunteerForm';
import VolunteerDashboard from '@/components/volunteer/VolunteerDashboard';
import PendingStatus from '@/components/volunteer/PendingStatus';
import { getApprovedVolunteersByCity } from '@/lib/api';

const Volunteers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('apply');
  const [showForm, setShowForm] = useState(false);
  const [volunteersByCity, setVolunteersByCity] = useState<{[city: string]: {name: string, phone: string}[]}>({});
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

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

  useEffect(() => {
    const fetchVolunteersByCity = async () => {
      try {
        setLoadingVolunteers(true);
        const data = await getApprovedVolunteersByCity();
        setVolunteersByCity(data);
      } catch (error) {
        console.error('Error fetching volunteers by city:', error);
      } finally {
        setLoadingVolunteers(false);
      }
    };

    fetchVolunteersByCity();
  }, []);

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
      setShowForm(false);
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
          
          {!volunteer ? (
            // Show application button if user has no volunteer record
            <>
              <div className="text-center mb-12">
                <p className="text-lg mb-6">
                  Стани част от екипа ни от доброволци и помогни на хората в нужда.
                </p>
                {!showForm ? (
                  <Button 
                    onClick={() => setShowForm(true)}
                    size="lg" 
                    className="animate-pulse bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="mr-2" />
                    Стани доброволец
                  </Button>
                ) : (
                  <div className="glass p-6 md:p-8 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">Кандидатствай за доброволец</h2>
                    <VolunteerForm onSuccess={handleFormSuccess} />
                    <div className="mt-4 text-center">
                      <Button variant="ghost" onClick={() => setShowForm(false)}>
                        Отказ
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Show dashboard or pending status based on approval status
            <div className="glass p-6 md:p-8 rounded-xl mb-10">
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
            </div>
          )}
          
          {/* Volunteers by City Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Доброволци по градове</h2>
            
            {loadingVolunteers ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse">Зареждане на доброволци...</div>
              </div>
            ) : Object.keys(volunteersByCity).length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">Все още няма одобрени доброволци.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(volunteersByCity).map(([city, volunteers]) => (
                  <Card key={city} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
                      <div className="flex items-center">
                        <MapPin className="text-purple-600 dark:text-purple-400 mr-2" />
                        <CardTitle className="text-lg">{city}</CardTitle>
                      </div>
                      <CardDescription>{volunteers.length} доброволеца</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {volunteers.map((volunteer, index) => (
                          <li key={index} className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-md">
                            <span>{volunteer.name}</span>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{volunteer.phone}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Volunteers;
