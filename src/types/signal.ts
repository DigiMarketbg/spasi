
import { z } from "zod";

export const signalSchema = z.object({
  title: z.string().min(3, {
    message: "Заглавието трябва да бъде поне 3 символа.",
  }),
  description: z.string().min(10, {
    message: "Описанието трябва да бъде поне 10 символа.",
  }),
  category: z.string().min(1, {
    message: "Моля, изберете категория.",
  }),
  city: z.string().min(1, {
    message: "Моля, въведете град.",
  }),
  phone: z.string().optional(),
  link: z.string().url({
    message: "Моля, въведете валиден URL адрес.",
  }).optional().or(z.literal('')),
  is_urgent: z.boolean().optional().default(false), // Added to the schema
});

export type SignalFormValues = z.infer<typeof signalSchema>;

export interface Signal {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  phone?: string | null;
  link?: string | null;
  image_url?: string | null;
  is_approved: boolean;
  is_resolved: boolean;
  is_urgent: boolean;
  created_at: string;
  user_id: string;
  status: string;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
}
