
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalForm from '@/components/SignalForm';
import { useToast } from '@/hooks/use-toast';

const SubmitSignal = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    toast({
      title: "Успешно подаден сигнал",
      description: "Сигналът беше изпратен успешно и ще бъде прегледан от администратор.",
      variant: "default",
    });
    
    // Редирект към началната страница след кратко забавяне
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Подай сигнал</h1>
          
          <div className="glass p-6 md:p-8 rounded-xl">
            <p className="text-muted-foreground mb-6 text-center">
              Подаването на сигнал е бърз начин да помогнеш на някого. 
              Сигналите се преглеждат от нашия екип преди да бъдат публикувани.
            </p>
            
            <SignalForm onSuccess={handleFormSuccess} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubmitSignal;
