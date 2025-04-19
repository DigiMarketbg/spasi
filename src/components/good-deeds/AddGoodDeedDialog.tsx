
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.full_name) {
      setAuthorName(profile.full_name);
    } else {
      setAuthorName('');
    }
  }, [profile]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsAnonymous(false);
    if (profile?.full_name) {
      setAuthorName(profile.full_name);
    } else {
      setAuthorName('');
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting good deed:", { title, description, isAnonymous, authorName });

    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Моля, въведете заглавие на доброто дело.",
      });
      return;
    }
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Моля, опишете доброто дело.",
      });
      return;
    }

    try {
      setIsLoading(true);
      let nameToUse = isAnonymous ? undefined : authorName;

      console.log(`Calling addGoodDeed with description length ${description.trim().length}, authorName: ${nameToUse}, title: ${title.trim()}`);
      await addGoodDeed(description.trim(), nameToUse, title.trim());

      toast({
        title: "Благодарим ви!",
        description: "Вашето добро дело беше регистрирано успешно.",
      });
      onAdd();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding good deed:", error);
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
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
            <Label htmlFor="title">Заглавие</Label>
            <Input
              id="title"
              placeholder="Въведете заглавие"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorName">Вашето име</Label>
            <Input
              id="authorName"
              value={authorName}
              readOnly
              className="bg-[#1A1F2C] text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAnonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !description.trim()}
            className="w-full bg-[#ea384c] hover:bg-[#c52c3f] text-white"
          >
            {isLoading ? "Регистриране..." : "Регистрирай"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoodDeedDialog;

