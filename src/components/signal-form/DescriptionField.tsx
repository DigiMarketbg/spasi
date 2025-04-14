
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface DescriptionFieldProps {
  control: Control<any>;
}

const DescriptionField = ({ control }: DescriptionFieldProps) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Описание</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Подробно описание на сигнала"
              className="min-h-[120px] bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Опишете подробно ситуацията, за да получите най-добра помощ
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
