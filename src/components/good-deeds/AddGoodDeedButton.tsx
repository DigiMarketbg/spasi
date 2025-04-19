
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useState } from "react";
import { addGoodDeed } from "@/lib/api/good-deeds";

interface AddGoodDeedButtonProps {
  onAdd: () => void;
}

const AddGoodDeedButton = ({ onAdd }: AddGoodDeedButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await addGoodDeed();
      toast({
        title: "Благодарим ви!",
        description: "Вашето добро дело беше регистрирано успешно.",
      });
      onAdd();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: error instanceof Error ? error.message : "Възникна грешка при регистриране на доброто дело.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full md:w-auto"
    >
      <Check className="mr-2 h-4 w-4" />
      Регистрирай добро дело
    </Button>
  );
};

export default AddGoodDeedButton;
