
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Import form schema and components
import { formSchema, FormValues } from './signal-form/FormSchema';
import CategoryField from './signal-form/CategoryField';
import TitleField from './signal-form/TitleField';
import CityField from './signal-form/CityField';
import DescriptionField from './signal-form/DescriptionField';
import PhoneField from './signal-form/PhoneField';
import LinkField from './signal-form/LinkField';
import SubmitButton from './signal-form/SubmitButton';
import ErrorAlert from './signal-form/ErrorAlert';

interface SignalFormProps {
  onSuccess?: () => void;
}

const SignalForm = ({ onSuccess }: SignalFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      title: '',
      city: '',
      description: '',
      link: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setError("Трябва да сте влезли в профила си, за да подадете сигнал");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Extract image URL from link if it looks like an image
      let imageUrl = null;
      if (data.link && isImageUrl(data.link)) {
        imageUrl = data.link;
      }
      
      // Save signal to database
      console.log("Saving signal to database with data:", {
        user_id: user.id,
        category: data.category,
        title: data.title,
        city: data.city,
        imageUrl: imageUrl
      });
      
      const { error: signalError } = await supabase.from('signals').insert({
        user_id: user.id,
        category: data.category,
        title: data.title,
        description: data.description,
        city: data.city,
        link: data.link || null,
        image_url: imageUrl,
        phone: data.phone || null,
        is_approved: false,
        is_resolved: false
      });
      
      if (signalError) {
        console.error("Database error when saving signal:", signalError);
        throw signalError;
      }
      
      // Reset form
      form.reset();
      
      // Show success message
      toast({
        title: "Успешно подаден сигнал",
        description: "Сигналът беше изпратен успешно и ще бъде прегледан от администратор.",
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Грешка при подаване на сигнал:', error);
      setError(error.message || "Възникна грешка при подаването на сигнала");
      
      toast({
        variant: "destructive",
        title: "Грешка при подаване на сигнал",
        description: error.message || "Възникна грешка при подаването на сигнала",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to detect if a URL is an image
  const isImageUrl = (url: string): boolean => {
    try {
      // Check if URL ends with common image extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const lowercaseUrl = url.toLowerCase();
      
      return imageExtensions.some(ext => lowercaseUrl.endsWith(ext)) || 
             lowercaseUrl.includes('imgur.com') ||
             lowercaseUrl.includes('ibb.co') ||
             lowercaseUrl.includes('postimg.cc');
    } catch (e) {
      return false;
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ErrorAlert error={error} />
        <CategoryField control={form.control} />
        <TitleField control={form.control} />
        <CityField control={form.control} />
        <DescriptionField control={form.control} />
        <PhoneField control={form.control} />
        <LinkField control={form.control} />
        
        <SubmitButton 
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default SignalForm;
