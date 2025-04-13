
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Check,
  Trash2,
  ExternalLink
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const signalSchema = z.object({
  title: z.string().min(3, {
    message: "Заглавието трябва да бъде поне 3 символа.",
  }),
  description: z.string().min(10, {
    message: "Описанието трябва да бъде поне 10 символа.",
  }),
  category: z.string().min(1, {
    message: "Моля, изберете категория.",
  }),
  city: z.string().min(1, {
    message: "Моля, въведете град.",
  }),
  phone: z.string().optional(),
  link: z.string().url({
    message: "Моля, въведете валиден URL адрес.",
  }).optional().or(z.literal('')),
});

type SignalFormValues = z.infer<typeof signalSchema>;

const SignalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signal, setSignal] = useState<any>(null);
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
      setSignal({ ...signal, is_approved: !currentStatus });
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
      setSignal({ ...signal, is_resolved: !currentStatus });
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
      setSignal({ 
        ...signal, 
        title: values.title,
        description: values.description,
        category: values.category,
        city: values.city,
        phone: values.phone || null,
        link: values.link || null
      });
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
                <div className="flex gap-2">
                  {isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Отказ
                    </Button>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Редактирай
                    </Button>
                  )}
                  <Button variant="destructive" onClick={deleteSignal}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Изтрий
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Заглавие</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Категория</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Град</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Описание</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Телефон (опционално)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="link"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Линк (опционално)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Запази промените
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{signal.category}</Badge>
                      <Badge variant={signal.is_approved ? "default" : "outline"}>
                        {signal.is_approved ? 'Одобрен' : 'Неодобрен'}
                      </Badge>
                      <Badge variant={signal.is_resolved ? "success" : "destructive"}>
                        {signal.is_resolved ? 'Разрешен' : 'Неразрешен'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-muted-foreground">Град</Label>
                        <p className="font-medium">{signal.city}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Дата на създаване</Label>
                        <p className="font-medium">{formatDate(signal.created_at)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">Описание</Label>
                      <p className="mt-1 whitespace-pre-line">{signal.description}</p>
                    </div>
                    
                    {(signal.phone || signal.link) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {signal.phone && (
                          <div>
                            <Label className="text-muted-foreground">Телефон</Label>
                            <p className="font-medium">
                              <a 
                                href={`tel:${signal.phone}`} 
                                className="text-primary hover:underline"
                                aria-label="Обади се"
                              >
                                {signal.phone}
                              </a>
                            </p>
                          </div>
                        )}
                        
                        {signal.link && (
                          <div>
                            <Label className="text-muted-foreground">Линк</Label>
                            <p className="font-medium">
                              <a 
                                href={signal.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary flex items-center gap-1 hover:underline"
                              >
                                {signal.link.substring(0, 30)}...
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-muted-foreground">Подал</Label>
                      <p className="font-medium">
                        {signal.profiles?.full_name || signal.profiles?.email || 'Неизвестен'}
                      </p>
                    </div>
                    
                    {signal.image_url && (
                      <div>
                        <Label className="text-muted-foreground">Изображение</Label>
                        <div className="mt-2">
                          <img 
                            src={signal.image_url} 
                            alt={signal.title} 
                            className="max-w-full h-auto max-h-[300px] rounded-md border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex gap-4 flex-wrap">
                <Button 
                  variant={signal.is_approved ? "destructive" : "default"}
                  onClick={() => toggleSignalApproval(signal.is_approved)}
                >
                  {signal.is_approved ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  {signal.is_approved ? 'Премахни одобрение' : 'Одобри сигнала'}
                </Button>
                
                <Button 
                  variant={signal.is_resolved ? "destructive" : "default"}
                  onClick={() => toggleSignalResolution(signal.is_resolved)}
                >
                  {signal.is_resolved ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  {signal.is_resolved ? 'Маркирай като неразрешен' : 'Маркирай като разрешен'}
                </Button>
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
