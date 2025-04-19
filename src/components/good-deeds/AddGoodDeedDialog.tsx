
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { addGoodDeed } from "@/lib/api/good-deeds";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/components/AuthProvider';

interface AddGoodDeedDialogProps {
  onAdd: () => void;
}

const AddGoodDeedDialog = ({ onAdd }: AddGoodDeedDialogProps) => {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set author name from profile when component mounts or profile changes
  useEffect(() => {
    if (profile?.first_name && profile?.last_name) {
      setAuthorName(`${profile.first_name} ${profile.last_name}`);
    }
  }, [profile]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Use authorName only if not anonymous
      const name = isAnonymous ? undefined : authorName;
      
      await addGoodDeed(description, name);
      toast({
        title: "Благодарим ви!",
        description: "Вашето добро дело беше регистрирано успешно.",
      });
      onAdd();
      setIsOpen(false);
      resetForm();
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

  const resetForm = () => {
    setDescription("");
    // Reset author name to profile name
    if (profile?.first_name && profile?.last_name) {
      setAuthorName(`${profile.first_name} ${profile.last_name}`);
    } else {
      setAuthorName("");
    }
    setIsAnonymous(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="w-8 h-8 sm:w-full sm:h-full bg-[#ea384c] hover:bg-[#c52c3f] text-white flex items-center justify-center rounded-lg">
          <Plus size={14} strokeWidth={3} className="m-auto" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Опишете доброто дело</DialogTitle>
          <DialogDescription>
            Споделете доброто дело, което направихте днес
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="authorName">Вашето име</Label>
            <Input
              id="authorName"
              placeholder="Въведете вашето име"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={isAnonymous}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isAnonymous" 
              checked={isAnonymous}
              onCheckedChange={(checked) => {
                setIsAnonymous(checked === true);
              }}
            />
            <Label htmlFor="isAnonymous" className="cursor-pointer">
              Публикувай анонимно
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Опишете накратко какво добро направихте днес..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || (!description)}
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
