
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { dangerousAreaSchema } from '@/types/dangerous-area';
import type { DangerousAreaFormValues } from '@/types/dangerous-area';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, AlertTriangle, Link as LinkIcon } from 'lucide-react';

const DangerousAreaForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DangerousAreaFormValues>({
    resolver: zodResolver(dangerousAreaSchema),
    defaultValues: {
      location: '',
      region: '',
      description: '',
      severity: 'medium',
      map_link: '',
      reported_by_name: '',
    },
  });

  const onSubmit = async (data: DangerousAreaFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('dangerous_areas')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
        }]);
      
      if (error) throw error;
      
      toast.success('Опасният участък беше добавен успешно!');
      navigate('/dangerous-areas');
    } catch (error) {
      console.error('Error submitting dangerous area:', error);
      toast.error('Възникна грешка при добавянето на опасен участък.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Местоположение*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Например: Път Е-79, км 45"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Въведете точно местоположение на опасния участък
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Region */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Област/Регион</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Например: София област"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Въведете област или регион на опасния участък
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишете опасния участък и какви мерки за безопасност трябва да се вземат"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Добавете подробно описание, за да могат хората да разберат опасността
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Severity */}
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Степен на опасност*</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Изберете степен на опасност" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                            Ниска опасност
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                            Средна опасност
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-red-500"></span>
                            Висока опасност
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Изберете колко опасен е участъкът
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Map Link */}
            <FormField
              control={form.control}
              name="map_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Линк към карта</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="https://maps.google.com/..."
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Добавете линк към Google Maps или друга карта (незадължително)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Reported By Name */}
            <FormField
              control={form.control}
              name="reported_by_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вашето име</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Име (незадължително)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Въведете вашето име, ако желаете (незадължително)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white"
            >
              {isSubmitting ? (
                'Изпращане...'
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" /> Добави опасен участък
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DangerousAreaForm;
