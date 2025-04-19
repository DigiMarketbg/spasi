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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
const AddGoodDeedDialog = ({
  onAdd,
  open,
  onOpenChange
}: AddGoodDeedDialogProps) => {
  const {
    profile
  } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set author name from profile when component mounts or profile changes
  useEffect(() => {
    if (profile?.full_name) {
      setAuthorName(profile.full_name);
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
        description: "Вашето добро дело беше регистрирано успешно."
      });
      onAdd();
      if (isControlled) {
        onOpenChange(false);
      } else {
        setInternalOpen(false);
      }
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: error instanceof Error ? error.message : "Възникна грешка при регистриране на доброто дело."
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setDescription("");
    // Reset author name to profile name
    if (profile?.full_name) {
      setAuthorName(profile.full_name);
    } else {
      setAuthorName("");
    }
    setIsAnonymous(false);
  };
  const handleOpenChange = (openState: boolean) => {
    if (isControlled) {
      onOpenChange(openState);
    } else {
      setInternalOpen(openState);
    }
    if (!openState) {
      resetForm();
    }
  };
  return <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        
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
            <Input id="authorName" value={authorName} readOnly className="bg-[#1A1F2C] text-white" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isAnonymous" checked={isAnonymous} onCheckedChange={checked => {
            setIsAnonymous(checked === true);
          }} />
            <Label htmlFor="isAnonymous" className="cursor-pointer">
              Публикувай анонимно
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" placeholder="Опишете накратко какво добро направихте днес..." value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px]" />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading || !description} className="w-full bg-[#ea384c] hover:bg-[#c52c3f] text-white">
            Регистрирай
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};
export default AddGoodDeedDialog;