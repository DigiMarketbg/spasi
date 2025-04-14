import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignalForm from '@/components/SignalForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { AlertCircle, Image } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const SubmitSignal = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Only determine authentication state after loading is completed
    if (!loading) {
      setIsAuthenticated(!!user);
      
      if (!user) {
        toast({
          title: "Достъп забранен",
          description: "За да подадете сигнал, трябва да влезете в профила си.",
          variant: "destructive",
        });
      }
    }
  }, [user, loading, toast]);

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

  const handleLoginClick = () => {
    navigate('/auth');
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow mt-20 container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto text-center">
            <p>Зареждане...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Подай сигнал</h1>
          
          {!isAuthenticated ? (
            <div className="glass p-6 md:p-8 rounded-xl">
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Достъп забранен. За да подадете сигнал, трябва да влезете в профила си.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <Button onClick={handleLoginClick} className="bg-spasi-red hover:bg-spasi-red/90">
                  Вход в профила
                </Button>
              </div>
            </div>
          ) : (
            <>
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
                
                <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                  <Image className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300">
                    За да добавите снимка към сигнала, моля използвайте директен линк към изображение. 
                    Можете да качите снимка на безплатни услуги като imgur.com, postimg.cc или други и да копирате линка.
                  </AlertDescription>
                </Alert>
                
                <SignalForm onSuccess={handleFormSuccess} />
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubmitSignal;
