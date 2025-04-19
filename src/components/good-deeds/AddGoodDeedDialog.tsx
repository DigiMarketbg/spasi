
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { addGoodDeed } from "@/lib/api/good-deeds";

interface AddGoodDeedDialogProps {
  onAdd: () => void;
}

const AddGoodDeedDialog = ({ onAdd }: AddGoodDeedDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await addGoodDeed(description);
      toast({
        title: "Благодарим ви!",
        description: "Вашето добро дело беше регистрирано успешно.",
      });
      onAdd();
      setIsOpen(false);
      setDescription("");
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-8 h-8 sm:w-full sm:h-full bg-[#ea384c] hover:bg-[#c52c3f] text-white flex items-center justify-center rounded-lg">
          <Plus size={14} strokeWidth={3} className="m-auto" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Опишете доброто дело</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Textarea
            placeholder="Опишете накратко какво добро направихте днес..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button 
            onClick={handleSubmit}
            disabled={isLoading} 
            className="w-full bg-[#ea384c] hover:bg-[#c52c3f] text-white"
          >
            Регистрирай
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoodDeedDialog;
