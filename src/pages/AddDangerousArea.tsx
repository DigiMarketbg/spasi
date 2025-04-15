
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import DangerousAreaForm from '@/components/dangerous-areas/DangerousAreaForm';
import DangerousAreaSubmitConfirmation from '@/components/dangerous-areas/DangerousAreaSubmitConfirmation';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddDangerousArea = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleAddAnother = () => {
    setIsSubmitted(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => navigate('/dangerous-areas')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Назад към всички участъци
            </Button>
            
            {!isSubmitted ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-destructive" /> 
                    Докладвай опасен участък
                  </h1>
                  <p className="text-muted-foreground">
                    Споделете информация за опасен пътен участък, за да предпазим другите шофьори
                  </p>
                </div>
                
                <DangerousAreaForm onSubmitSuccess={handleSubmitSuccess} />
              </>
            ) : (
              <DangerousAreaSubmitConfirmation onAddAnother={handleAddAnother} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddDangerousArea;
