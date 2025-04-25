
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { VolunteerFormValues } from '../schema/volunteerFormSchema';
import { secureDataAccess } from '@/lib/api/security';

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
      // Use our secure data access helper for the insert operation
      await secureDataAccess.insert('volunteers', {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone || null,
        city: values.city,
        can_help_with: values.can_help_with,
        motivation: values.motivation || null,
      }, { withUserId: true });

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
