
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";
import { Control } from "react-hook-form";

interface ImageUrlFieldProps {
  control: Control<any>;
}

const ImageUrlField = ({ control }: ImageUrlFieldProps) => {
  return (
    <FormField
      control={control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Линк към снимка</FormLabel>
          <FormControl>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="https://..."
                className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm pl-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription className="flex items-start gap-1.5">
            <Image className="h-4 w-4 mt-0.5 text-primary" />
            <span>
              Добавете директен линк към изображение (например от imgur.com, ibb.co, postimg.cc и др.)
            </span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUrlField;
