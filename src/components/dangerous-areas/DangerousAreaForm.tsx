
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { dangerousAreaSchema, DangerousAreaFormValues } from '@/types/dangerous-area';
import { addDangerousArea } from '@/lib/api/dangerous-areas';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface DangerousAreaFormProps {
  onSubmitSuccess?: () => void;
}

const DangerousAreaForm: React.FC<DangerousAreaFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
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
      // Ensure all required fields are passed explicitly and properly typed
      await addDangerousArea({
        location: data.location,
        region: data.region,
        description: data.description,
        severity: data.severity,
        map_link: data.map_link || null,
        reported_by_name: data.reported_by_name || null
      });
      
      toast.success('Опасният участък е докладван успешно', {
        description: 'Сигналът ще бъде прегледан от администратор преди публикуване',
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/dangerous-areas');
      }
    } catch (error) {
      console.error('Error submitting dangerous area:', error);
      toast.error('Възникна грешка', {
        description: 'Не успяхме да регистрираме опасния участък. Моля, опитайте отново.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="border-none bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Местоположение*</FormLabel>
                    <FormControl>
                      <Input placeholder="Въведете местоположение" {...field} />
                    </FormControl>
                    <FormDescription>
                      Посочете конкретното местоположение на опасния участък
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регион</FormLabel>
                    <FormControl>
                      <Input placeholder="Въведете регион" {...field} />
                    </FormControl>
                    <FormDescription>
                      Област или град
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Степен на опасност*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Изберете степен на опасност" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Ниска</SelectItem>
                      <SelectItem value="medium">Средна</SelectItem>
                      <SelectItem value="high">Висока</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Оценете колко опасен е участъкът
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Въведете подробно описание на опасния участък" 
                      {...field} 
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Подробно опишете опасността - какъв е пътят, какви опасности има, и др.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="map_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Връзка към карта
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Въведете линк към Google Maps или друга карта" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Добавете линк към точното местоположение в Google Maps
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reported_by_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вашето име</FormLabel>
                  <FormControl>
                    <Input placeholder="Въведете вашето име (незадължително)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Името ви ще бъде показано като докладвано от вас (незадължително)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 flex flex-col md:flex-row gap-3 justify-between">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Забележка:</strong> Всички доклади за опасни участъци се преглеждат от нашите администратори преди публикуване.
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Изпращане...
                  </>
                ) : 'Изпрати сигнал'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DangerousAreaForm;
