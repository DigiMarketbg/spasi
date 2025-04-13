
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Mail, MessageCircle } from 'lucide-react';

const ContactForm = () => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: data.message,
          subject: data.subject || 'Общо запитване'
        });

      if (error) throw error;

      toast({
        title: "Съобщението е изпратено успешно",
        description: "Благодарим ви за запитването. Ще се свържем с вас възможно най-скоро.",
      });

      reset();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Грешка при изпращане",
        description: error.message || "Възникна проблем при изпращането на съобщението. Моля, опитайте отново.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Свържете се с нас
        </CardTitle>
        <CardDescription>
          Попълнете формата, за да изпратите запитване или съобщение до нашия екип
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Име <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                placeholder="Вашето име" 
                {...register('name', { required: true })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Имейл <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@email.com" 
                {...register('email', { required: true })} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input 
                id="phone" 
                placeholder="Телефон за връзка" 
                {...register('phone')} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Тема</Label>
              <Input 
                id="subject" 
                placeholder="Тема на съобщението" 
                {...register('subject')} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Съобщение <span className="text-red-500">*</span></Label>
            <Textarea 
              id="message" 
              placeholder="Въведете вашето съобщение тук..." 
              rows={5}
              {...register('message', { required: true })} 
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Изпращане...' : 'Изпрати съобщение'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
