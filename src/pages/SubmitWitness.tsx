
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { submitWitness } from '@/lib/api/witnesses';
import { WitnessFormValues, witnessSchema } from '@/types/witness';
import WitnessForm from '@/components/witnesses/WitnessForm';

const SubmitWitness = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<WitnessFormValues>({
    resolver: zodResolver(witnessSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      date: '',
      phone: '',
      contact_name: ''
    }
  });

  const onSubmit = async (values: WitnessFormValues) => {
    if (!user) {
      toast.error("Трябва да влезете в акаунта си, за да публикувате обява");
      navigate('/auth');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const witnessData = { ...values };
      
      const witnessId = await submitWitness(witnessData, user.id);
      
      toast.success('Обявата е изпратена успешно!', {
        description: 'Тя ще бъде прегледана от нашия екип и публикувана след одобрение.'
      });
      
      navigate('/witnesses');
    } catch (error: any) {
      console.error('Error submitting witness post:', error);
      toast.error('Грешка при изпращане', {
        description: error.message || 'Моля, опитайте отново по-късно.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 bg-card shadow-lg rounded-lg border border-border">
            <h1 className="text-2xl font-bold mb-4 text-center">Трябва да влезете в акаунта си</h1>
            <p className="text-muted-foreground mb-6 text-center">
              За да публикувате обява за свидетели, първо трябва да влезете в своя акаунт.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/witnesses')}
              >
                Назад
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
              >
                Вход / Регистрация
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Публикуване на обява за свидетели</h1>
          <p className="text-muted-foreground mb-6">
            Попълнете формата по-долу, за да публикувате обява за търсене на свидетели или за да споделите, че сте били свидетел на инцидент.
          </p>
          
          <div className="bg-card shadow-sm border border-border rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <WitnessForm form={form} />
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Обявата ще бъде активна за 7 дни след одобрение от модератор, след което ще бъде автоматично изтрита.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/witnesses')}
                    >
                      Отказ
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-spasi-red hover:bg-spasi-red/90"
                    >
                      {isSubmitting ? 'Изпращане...' : 'Публикувай обява'}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubmitWitness;
