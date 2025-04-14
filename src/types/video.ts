
import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().min(3, {
    message: "Заглавието трябва да бъде поне 3 символа.",
  }),
  youtube_url: z.string().url({
    message: "Моля, въведете валиден YouTube URL.",
  }),
  description: z.string().optional(),
  is_published: z.boolean().default(false),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export interface Video {
  id: string;
  title: string;
  youtube_url: string;
  description?: string | null;
  is_published: boolean;
  created_at: string;
}
