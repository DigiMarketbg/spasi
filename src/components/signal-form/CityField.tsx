
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Control } from "react-hook-form";

interface CityFieldProps {
  control: Control<any>;
}

const CityField = ({ control }: CityFieldProps) => {
  return (
    <FormField
      control={control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Град</FormLabel>
          <FormControl>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Въведете град"
                className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm pl-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CityField;
