
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { VolunteerFormData, HELP_OPTIONS, BULGARIAN_CITIES } from '@/types/volunteer';

// Define the validation schema
const volunteerFormSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Името трябва да съдържа поне 2 символа',
  }),
  email: z.string().email({
    message: 'Моля, въведете валиден имейл адрес',
  }),
  phone: z.string().optional(),
  city: z.string().min(1, {
    message: 'Моля, изберете град',
  }),
  can_help_with: z.array(z.string()).min(1, {
    message: 'Моля, изберете поне една опция',
  }),
  motivation: z.string().optional(),
});

interface VolunteerFormProps {
  onSuccess: () => void;
  existingData?: VolunteerFormData;
}

const VolunteerForm = ({ onSuccess, existingData }: VolunteerFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof volunteerFormSchema>>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: existingData || {
      full_name: '',
      email: '',
      phone: '',
      city: '',
      can_help_with: [],
      motivation: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof volunteerFormSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Трябва да сте влезли в акаунта си, за да кандидатствате.",
      });
      return;
    }

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
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Input placeholder="Въведете пълното си име" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имейл</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон (по желание)</FormLabel>
              <FormControl>
                <Input placeholder="+359 89 123 4567" {...field} />
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
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...field}
                  defaultValue=""
                >
                  <option value="" disabled>Изберете град</option>
                  {BULGARIAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="can_help_with"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>В какво можете да помагате</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {HELP_OPTIONS.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="can_help_with"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Мотивация (по желание)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Защо искате да станете доброволец? Какви са вашите умения и опит?"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-spasi-red hover:bg-spasi-red/90">
          Изпрати заявка
        </Button>
      </form>
    </Form>
  );
};

export default VolunteerForm;
