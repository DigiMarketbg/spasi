
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { VolunteerFormValues } from '../schema/volunteerFormSchema';

export const useVolunteerSubmit = (onSuccess: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: VolunteerFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Трябва да сте влезли в акаунта си, за да кандидатствате.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('volunteers')
        .upsert({
          user_id: user.id,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || null,
          city: values.city,
          can_help_with: values.can_help_with,
          motivation: values.motivation || null,
        });

      if (error) throw error;

      toast({
        title: "Успешно подадена заявка",
        description: "Благодарим за интереса! Ще разгледаме заявката Ви възможно най-скоро.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: error.message || "Възникна проблем при подаването на заявката",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
