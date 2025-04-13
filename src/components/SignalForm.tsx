
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Camera, Link2, MapPin, Send, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signalCategories = [
  { value: 'blood', label: 'Нужда от кръводарители' },
  { value: 'missing', label: 'Изчезнал човек' },
  { value: 'stolen', label: 'Откраднат автомобил' },
  { value: 'danger', label: 'Опасен участък' },
  { value: 'help', label: 'Хора в беда' },
  { value: 'other', label: 'Друго' },
];

const formSchema = z.object({
  category: z.string({
    required_error: "Моля, изберете категория",
  }),
  title: z.string()
    .min(5, { message: "Заглавието трябва да е поне 5 символа" })
    .max(100, { message: "Заглавието не може да надвишава 100 символа" }),
  city: z.string()
    .min(2, { message: "Моля, въведете град" })
    .max(50, { message: "Името на града е твърде дълго" }),
  description: z.string()
    .min(20, { message: "Описанието трябва да е поне 20 символа" })
    .max(2000, { message: "Описанието не може да надвишава 2000 символа" }),
  link: z.string().url({ message: "Моля, въведете валиден URL адрес" }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface SignalFormProps {
  onSuccess?: () => void;
}

const SignalForm = ({ onSuccess }: SignalFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      title: '',
      city: '',
      description: '',
      link: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Файлът трябва да е по-малък от 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      setError(null);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `signals/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('signals')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('signals')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Грешка при качване на изображение:', error);
      return null;
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setError("Трябва да сте влезли в профила си, за да подадете сигнал");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = null;
      
      // Качване на изображение, ако има такова
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          throw new Error("Неуспешно качване на изображението");
        }
      }
      
      // Запазване на сигнала в базата данни
      const { error } = await supabase.from('signals').insert({
        user_id: user.id,
        category: data.category,
        title: data.title,
        description: data.description,
        city: data.city,
        link: data.link || null,
        image_url: imageUrl,
        is_approved: false,
        is_resolved: false
      });
      
      if (error) {
        throw error;
      }
      
      // Нулиране на формуляра
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      
      // Извикване на callback функцията при успех
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Грешка при подаване на сигнал:', error);
      setError(error.message || "Възникна грешка при подаването на сигнала");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm border-input">
                    <SelectValue placeholder="Изберете категория" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {signalCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Изберете категория, която най-добре описва сигнала
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заглавие</FormLabel>
              <FormControl>
                <Input
                  placeholder="Кратко и ясно заглавие"
                  className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm"
                  {...field}
                />
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
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Въведете град"
                    className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Подробно описание на сигнала"
                  className="min-h-[120px] bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Опишете подробно ситуацията, за да получите най-добра помощ
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Линк към Facebook пост (по избор)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="https://facebook.com/..."
                    className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Добавете линк към публикация в социалните мрежи, ако има такава
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-3">
          <FormLabel htmlFor="image">Снимка (по избор)</FormLabel>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-muted-foreground/50 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Качете снимка (до 5MB)</span>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Преглед" 
                  className="rounded-lg max-h-[200px] w-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  Премахни
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#d53369] to-[#daae51] hover:from-[#c62e5e] hover:to-[#c69d47] text-white font-bold py-3"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4 animate-spin" />
              Изпращане...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Изпрати сигнал
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignalForm;
