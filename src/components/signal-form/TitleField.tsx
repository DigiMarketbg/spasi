
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface TitleFieldProps {
  control: Control<any>;
}

const TitleField = ({ control }: TitleFieldProps) => {
  return (
    <FormField
      control={control}
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
  );
};

export default TitleField;
