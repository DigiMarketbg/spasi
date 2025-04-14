
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link2, Image } from "lucide-react";
import { Control } from "react-hook-form";

interface LinkFieldProps {
  control: Control<any>;
}

const LinkField = ({ control }: LinkFieldProps) => {
  return (
    <FormField
      control={control}
      name="link"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Линк (Facebook пост или снимка)</FormLabel>
          <FormControl>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
              За снимка: добавете директен линк към изображение (например от imgur.com, ibb.co, postimg.cc и др.)
            </span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LinkField;
