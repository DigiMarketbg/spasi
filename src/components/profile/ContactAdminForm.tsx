
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  message: z.string().min(5, 'Съобщението трябва да е поне 5 символа').max(500, 'Максимална дължина 500 символа'),
});

type FormValues = z.infer<typeof formSchema>;

const ContactAdminForm: React.FC = () => {
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the user's name from the profile or fallback to email
      const userName = profile?.full_name || user.email?.split('@')[0] || 'Потребител';
      
      // Insert the message into the contact_messages table
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user.id,
          name: userName,
          email: user.email,
          message: data.message,
          is_read: false,
          subject: `Съобщение от потребител: ${userName}`
        });
        
      if (error) throw error;
      
      toast({
        title: 'Съобщението е изпратено',
        description: 'Благодарим за обратната връзка!'
      });
      
      form.reset();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Грешка',
        description: 'Възникна проблем при изпращането на съобщението. Моля, опитайте отново.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">Свържете се с администратор</h2>
        <p className="text-sm text-muted-foreground">
          Изпратете съобщение до екипа на Spasi.bg
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Съобщение</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Вашето съобщение..." 
                    className="min-h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Опишете вашия въпрос или проблем
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Изпращане...' : 'Изпрати съобщение'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactAdminForm;
