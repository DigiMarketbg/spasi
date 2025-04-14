
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { uploadSignalImage } from '@/lib/api';

// Import form schema and components
import { formSchema, FormValues } from './signal-form/FormSchema';
import CategoryField from './signal-form/CategoryField';
import TitleField from './signal-form/TitleField';
import CityField from './signal-form/CityField';
import DescriptionField from './signal-form/DescriptionField';
import PhoneField from './signal-form/PhoneField';
import LinkField from './signal-form/LinkField';
import ImageUpload from './signal-form/ImageUpload';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // File validation is now handled in the ImageUpload component
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
    setError(null);
    
    // Log file details for debugging
    console.log(`Selected file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setError("Трябва да сте влезли в профила си, за да подадете сигнал");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      let imageUrl = null;
      
      // Upload image if there is one
      if (imageFile) {
        setIsUploading(true);
        console.log("Starting image upload process...");
        
        try {
          imageUrl = await uploadSignalImage(imageFile, (progress) => {
            setUploadProgress(progress);
          });
          
          console.log("Image upload result:", imageUrl ? "Success" : "Not uploaded");
        } catch (uploadError: any) {
          console.error("Error during image upload:", uploadError);
          // Continue with signal submission without the image
          imageUrl = null;
        } finally {
          setIsUploading(false);
        }
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
      setImageFile(null);
      setImagePreview(null);
      
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
      setUploadProgress(0);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
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
        
        <ImageUpload 
          imagePreview={imagePreview}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
        />
        
        <SubmitButton 
          isSubmitting={isSubmitting} 
          isUploading={isUploading} 
        />
      </form>
    </Form>
  );
};

export default SignalForm;
