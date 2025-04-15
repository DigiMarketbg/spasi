
import { z } from "zod";

export const witnessSchema = z.object({
  title: z.string().min(3, {
    message: "Заглавието трябва да бъде поне 3 символа.",
  }),
  description: z.string().min(10, {
    message: "Описанието трябва да бъде поне 10 символа.",
  }),
  location: z.string().min(1, {
    message: "Моля, въведете местоположение.",
  }),
  date: z.string().min(1, {
    message: "Моля, въведете дата на инцидента.",
  }),
  phone: z.string().optional(),
  contact_name: z.string().min(1, {
    message: "Моля, въведете име за контакт.",
  }),
});

export type WitnessFormValues = z.infer<typeof witnessSchema>;

export interface Witness {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  phone?: string | null;
  contact_name: string;
  image_url?: string | null;
  is_approved: boolean;
  created_at: string;
  expires_at: string;
  user_id: string;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
}
