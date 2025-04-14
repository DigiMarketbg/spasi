
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link2 } from "lucide-react";
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
  );
};

export default LinkField;
