
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ExternalLink, 
  Flag 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SignalDetailPublic = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [signal, setSignal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const fetchSignalDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('signals')
          .select('*')
          .eq('id', id)
          .eq('is_approved', true)
          .single();

        if (error) throw error;
        setSignal(data);
      } catch (error: any) {
        toast({
          title: "Грешка",
          description: "Сигналът не може да бъде зареден или не е одобрен.",
          variant: "destructive",
        });
        navigate('/signals');
      } finally {
        setLoading(false);
      }
    };

    fetchSignalDetails();
  }, [id, navigate, toast]);

  const handleReportSignal = async () => {
    if (!user || !id || !reportReason) {
      toast({
        title: "Грешка",
        description: "Моля, влезте в профила си и изберете причина за докладване.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          signal_id: id,
          reported_by: user.id,
          reason: reportReason
        });

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Сигналът е докладван. Благодарим ви!",
      });
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Не можахме да докладваме сигнала. Моля, опитайте отново.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Зареждане...</div>
      </div>
    );
  }

  if (!signal) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 mt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/signals')} 
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Обратно към всички сигнали
        </Button>

        <Card className="glass">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">{signal.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>{signal.category}</Badge>
                  <span className="text-muted-foreground">
                    {formatDate(signal.created_at)}
                  </span>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Flag className="h-4 w-4 mr-2" />
                    Докладвай
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Докладване на сигнал</AlertDialogTitle>
                    <AlertDialogDescription>
                      Моля, изберете причина за докладване на този сигнал.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="py-4">
                    <Select onValueChange={setReportReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Причина за докладване" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Невярна информация">Невярна информация</SelectItem>
                        <SelectItem value="Спам">Спам</SelectItem>
                        <SelectItem value="Дублиран сигнал">Дублиран сигнал</SelectItem>
                        <SelectItem value="Друго">Друго</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отказ</AlertDialogCancel>
                    <AlertDialogAction 
                      disabled={!reportReason}
                      onClick={handleReportSignal}
                    >
                      Докладвай
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  <strong>Град:</strong> {signal.city}
                </p>
                
                <p className="whitespace-pre-line">{signal.description}</p>
                
                {signal.link && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(signal.link, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Виж поста във Facebook
                    </Button>
                  </div>
                )}
              </div>
              
              {signal.image_url && (
                <div>
                  <img 
                    src={signal.image_url} 
                    alt={signal.title} 
                    className="rounded-lg max-h-[400px] w-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignalDetailPublic;
