
import { z } from "zod";

export const dangerousAreaSchema = z.object({
  location: z.string().min(3, {
    message: "Местоположението трябва да бъде поне 3 символа.",
  }),
  region: z.string().optional(),
  description: z.string().min(10, {
    message: "Описанието трябва да бъде поне 10 символа.",
  }),
  severity: z.enum(["low", "medium", "high"], {
    required_error: "Моля, изберете степен на опасност.",
  }),
  map_link: z.string().url({
    message: "Моля, въведете валиден URL адрес.",
  }).optional().or(z.literal('')),
  reported_by_name: z.string().optional(),
});

export type DangerousAreaFormValues = z.infer<typeof dangerousAreaSchema>;

export interface DangerousArea {
  id: string;
  created_at: string;
  location: string;
  region?: string | null;
  description: string;
  severity: "low" | "medium" | "high";
  map_link?: string | null;
  reported_by_name?: string | null;
  is_approved?: boolean;
}

