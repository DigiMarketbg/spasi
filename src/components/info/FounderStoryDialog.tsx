
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface FounderStoryDialogProps {
  triggerClassName?: string;
}

const FounderStoryDialog: React.FC<FounderStoryDialogProps> = ({ triggerClassName }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-2 ${triggerClassName}`}
        >
          <HeartHandshake className="h-4 w-4 text-spasi-red" />
          <span>Защо създадох Spasi.bg</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-lg max-h-[90vh] block">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Защо създадох Spasi.bg</DialogTitle>
          <DialogDescription className="sr-only">
            История за създаването на платформата
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[calc(90vh-120px)] md:h-[500px] pr-4">
          <div className="text-sm md:text-base space-y-4 pb-2">
            <p>
              Всеки ден в социалните мрежи се появяват викове за помощ – човек, който търси кръводарител. Майка, изгубила детето си. Възрастна жена, която няма кой да ѝ купи хляб. Колата ти е открадната, баба ти е паднала сама вкъщи, младо момиче изчезва на път за училище.
            </p>
            <p>
              Всички тези сигнали се разпръскват из Facebook групи, коментари и чатове. Шум. Паника. Забравени постове.
            </p>
            <p>
              Аз не искам да има повече шум. Искам да има отговор.
            </p>
            <p>
              Затова създадох Spasi.bg – платформа, в която можем да се съберем хората, които имаме нужда от помощ, и хората, които искат да помогнат.
            </p>
            <p>
              Тук не се търси дарение. Тук се търси действие. Кръв, свидетел, доброволец, дори просто – човек, който да занесе хляб. Всеки може да бъде нужен на някого.
            </p>
            <p>
              Направих това, защото съм бил там – в момента, когато няма кой да помогне. И знам, че има хиляди като мен.
            </p>
            <p>
              Spasi.bg е некомерсиална, независима платформа. Всичко се поддържа от един човек – мен. Вярвам, че ако я изградим заедно, тя ще остане тук за всички.
            </p>
            <p>
              За да не се губи време. За да не се губят хора. За да не се губи надежда.
            </p>
            <p className="font-medium">
              Добре дошъл в Spasi.bg. Място, където доброто не се разсейва.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FounderStoryDialog;
