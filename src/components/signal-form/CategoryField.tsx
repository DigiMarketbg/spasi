
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

const signalCategories = [
  { value: 'blood', label: 'Нужда от кръводарители' },
  { value: 'missing', label: 'Изчезнал човек' },
  { value: 'stolen', label: 'Откраднат автомобил' },
  { value: 'help', label: 'Хора в беда' },
  { value: 'other', label: 'Друго' },
];

interface CategoryFieldProps {
  control: Control<any>;
}

const CategoryField = ({ control }: CategoryFieldProps) => {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Категория</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-gradient-to-r from-background to-accent/30 backdrop-blur-sm border-input">
                <SelectValue placeholder="Изберете категория" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {signalCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Изберете категория, която най-добре описва сигнала
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
