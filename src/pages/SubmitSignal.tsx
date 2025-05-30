
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalForm from '@/components/SignalForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SubmitSignal = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for authentication to complete loading
    if (!loading) {
      setCheckingAuth(false);
      
      // Only redirect if user is definitely not logged in
      if (!user) {
        console.log('User not authenticated, redirecting to auth page');
        toast({
          title: "Достъп забранен",
          description: "За да подадете сигнал, трябва да влезете в профила си.",
          variant: "destructive",
        });
        navigate('/auth');
      } else {
        console.log('User is authenticated:', user.id);
      }
    }
  }, [user, loading, navigate, toast]);

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

  // Show loading state while checking authentication
  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow mt-20 container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Проверка на потребителски достъп...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Only render the form if the user is logged in
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Подай сигнал</h1>
          
          <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800 dark:text-amber-300">
              Молим за търпение при обработката на сигнали. В зависимост от натовареността, одобрението може да отнеме известно време. 
              При важни сигнали, по наша преценка може да изпратим известие до всички потребители на платформата.
            </AlertDescription>
          </Alert>
          
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
