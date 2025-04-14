
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Bell, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const notificationSchema = z.object({
  title: z.string().min(5, {
    message: 'Заглавието трябва да бъде поне 5 символа.',
  }),
  message: z.string().min(10, {
    message: 'Съобщението трябва да бъде поне 10 символа.',
  }),
  city: z.string().optional(),
  filterByCity: z.boolean().default(false),
  category: z.string().optional(),
  filterByCategory: z.boolean().default(false),
  url: z.string().url({
    message: 'Моля, въведете валиден URL адрес.'
  }).optional().or(z.literal('')),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

const SendPushNotificationForm = () => {
  const [isSending, setIsSending] = useState(false);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
      city: '',
      filterByCity: false,
      category: '',
      filterByCategory: false,
      url: '',
    },
  });

  const onSubmit = async (data: NotificationFormValues) => {
    setIsSending(true);
    
    try {
      // First, query subscribers based on filters
      let queryBuilder = supabase.from('push_subscribers').select('player_id');
      
      if (data.filterByCity && data.city) {
        queryBuilder = queryBuilder.eq('city', data.city);
      }
      
      if (data.filterByCategory && data.category) {
        queryBuilder = queryBuilder.contains('category', [data.category]);
      }
      
      const { data: subscribers, error } = await queryBuilder;
      
      if (error) {
        throw error;
      }
      
      if (!subscribers || subscribers.length === 0) {
        toast({
          title: 'Не са намерени абонати',
          description: 'Няма абонати, които отговарят на зададените критерии.',
          variant: 'destructive',
        });
        return;
      }
      
      // Extract player IDs
      const playerIds = subscribers.map(sub => sub.player_id);
      
      // Prepare notification data
      const notificationData = {
        app_id: "35af33cb-8ab8-4d90-b789-17fb5c45542b",
        headings: { "bg": data.title, "en": data.title },
        contents: { "bg": data.message, "en": data.message },
        include_player_ids: playerIds,
      };
      
      // Add URL if provided
      if (data.url) {
        notificationData.url = data.url;
      }
      
      // Send notification via OneSignal REST API
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic YOUR_REST_API_KEY' // This should be replaced with a secure method
        },
        body: JSON.stringify(notificationData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.errors?.[0] || 'Unknown error');
      }
      
      toast({
        title: 'Известието е изпратено успешно',
        description: `Изпратено до ${playerIds.length} абоната.`,
      });
      
      form.reset();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Грешка при изпращане',
        description: error.message || 'Възникна проблем при изпращането на известието.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Изпращане на push известие
        </CardTitle>
        <CardDescription>
          Изпратете push известие до абонираните потребители
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заглавие</FormLabel>
                  <FormControl>
                    <Input placeholder="Заглавие на известието" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Съобщение</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Текст на известието" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL адрес (незадължително)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://spasi.bg/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Когато потребителят кликне върху известието, ще бъде пренасочен към този адрес
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="filterByCity"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Филтриране по град</FormLabel>
                        <FormDescription>
                          Изпращане само на абонати от конкретен град
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch('filterByCity') && (
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Град</FormLabel>
                        <FormControl>
                          <Input placeholder="Въведете град" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="filterByCategory"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Филтриране по категория</FormLabel>
                        <FormDescription>
                          Изпращане само на абонати с интерес към конкретна категория
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch('filterByCategory') && (
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категория</FormLabel>
                        <FormControl>
                          <Input placeholder="Въведете категория" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            
            <CardFooter className="flex justify-end px-0 pt-4">
              <Button type="submit" disabled={isSending}>
                {isSending ? (
                  <div className="flex items-center">
                    <span className="mr-2">Изпращане...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Изпрати известие
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendPushNotificationForm;
