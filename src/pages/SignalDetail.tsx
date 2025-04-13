
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signalSchema, SignalFormValues, Signal } from "@/types/signal";

// Import the newly created components
import SignalForm from '@/components/admin/SignalForm';
import SignalDetails from '@/components/admin/SignalDetails';
import SignalActions from '@/components/admin/SignalActions';
import SignalStatusActions from '@/components/admin/SignalStatusActions';

const SignalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loadingSignal, setLoadingSignal] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Setup form
  const form = useForm<SignalFormValues>({
    resolver: zodResolver(signalSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      city: "",
      phone: "",
      link: ""
    }
  });

  // Check if user is admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Достъп забранен",
        description: "Нямате право да достъпвате тази страница.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate, toast]);

  // Fetch signal details
  const fetchSignalDetails = async () => {
    if (!id) return;
    
    setLoadingSignal(true);
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*, profiles:user_id(full_name, email)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setSignal(data);
      
      // Set form default values
      form.reset({
        title: data.title,
        description: data.description,
        category: data.category,
        city: data.city,
        phone: data.phone || "",
        link: data.link || ""
      });
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при зареждането на сигнала.",
        variant: "destructive",
      });
      navigate('/admin');
    } finally {
      setLoadingSignal(false);
    }
  };

  useEffect(() => {
    if (isAdmin && id) {
      fetchSignalDetails();
    }
  }, [isAdmin, id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Toggle signal approval
  const toggleSignalApproval = async (currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е одобрен." : "Одобрението на сигнала е премахнато.",
      });

      // Update signal data
      setSignal(prev => prev ? { ...prev, is_approved: !currentStatus } : null);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Toggle signal resolution
  const toggleSignalResolution = async (currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_resolved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е маркиран като разрешен." : "Сигналът е маркиран като неразрешен.",
      });

      // Update signal data
      setSignal(prev => prev ? { ...prev, is_resolved: !currentStatus } : null);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const onSubmit = async (values: SignalFormValues) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({
          title: values.title,
          description: values.description,
          category: values.category,
          city: values.city,
          phone: values.phone || null,
          link: values.link || null
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Информацията за сигнала е обновена.",
      });

      // Update signal data and exit edit mode
      setSignal(prev => prev ? { 
        ...prev, 
        title: values.title,
        description: values.description,
        category: values.category,
        city: values.city,
        phone: values.phone || null,
        link: values.link || null
      } : null);
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Delete signal
  const deleteSignal = async () => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този сигнал? Това действие е необратимо.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('signals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Сигналът е изтрит успешно.",
      });

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при изтриването на сигнала.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Зареждане...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Обратно към администраторския панел
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Детайли за сигнал</h1>
        
        {loadingSignal ? (
          <div className="text-center py-8">Зареждане на сигнала...</div>
        ) : signal ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{!isEditing && signal.title}</CardTitle>
                  <CardDescription>Сигнал #{id?.substring(0, 8)}</CardDescription>
                </div>
                <SignalActions 
                  isEditing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onCancel={() => setIsEditing(false)}
                  onDelete={deleteSignal}
                />
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <SignalForm 
                    form={form} 
                    onSubmit={onSubmit} 
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <SignalDetails signal={signal} formatDate={formatDate} />
                )}
              </CardContent>
              
              <CardFooter>
                <SignalStatusActions
                  isApproved={signal.is_approved}
                  isResolved={signal.is_resolved}
                  onToggleApproval={toggleSignalApproval}
                  onToggleResolution={toggleSignalResolution}
                />
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Сигналът не е намерен</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SignalDetail;
