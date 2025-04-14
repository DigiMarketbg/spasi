
import * as z from 'zod';

// Define the validation schema
export const volunteerFormSchema = z.object({
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

export type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;
