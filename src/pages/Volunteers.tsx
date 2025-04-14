
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useVolunteerData } from '@/hooks/useVolunteerData';
import ApplyButton from '@/components/volunteer/ApplyButton';
import VolunteerTabs from '@/components/volunteer/VolunteerTabs';
import VolunteersByCity from '@/components/volunteer/VolunteersByCity';

const Volunteers = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('apply');
  const { 
    volunteer, 
    loading, 
    volunteersByCity, 
    loadingVolunteers, 
    handleFormSuccess 
  } = useVolunteerData({ userId: user?.id });

  // Set initial active tab based on volunteer status
  React.useEffect(() => {
    if (volunteer) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('apply');
    }
  }, [volunteer]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Доброволци</h1>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Зареждане...</div>
            </div>
          ) : (
            <>
              {!volunteer ? (
                // Show application button if user has no volunteer record
                <div className="text-center mb-12">
                  <p className="text-lg mb-6">
                    Стани част от екипа ни от доброволци и помогни на хората в нужда.
                  </p>
                  <ApplyButton onSuccess={handleFormSuccess} />
                </div>
              ) : (
                // Show dashboard or pending status based on approval status
                <VolunteerTabs 
                  volunteer={volunteer} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  onFormSuccess={handleFormSuccess} 
                />
              )}
            </>
          )}
          
          {/* Volunteers by City Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Доброволци по градове</h2>
            <VolunteersByCity 
              volunteersByCity={volunteersByCity} 
              loading={loadingVolunteers} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Volunteers;
