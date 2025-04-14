
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { Control } from "react-hook-form";

interface PhoneFieldProps {
  control: Control<any>;
}

const PhoneField = ({ control }: PhoneFieldProps) => {
  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Телефон за връзка (по избор)</FormLabel>
          <FormControl>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="0888123456 или +359888123456"
                className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm pl-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription>
            Въведете телефонен номер за контакт при нужда
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneField;
