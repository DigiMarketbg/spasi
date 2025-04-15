
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ShieldCheck, Info } from "lucide-react";

// Custom hook to manage GDPR consent
export const useGDPRConsent = () => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('gdpr-consent');
    if (consent === 'accepted') {
      setHasConsented(true);
    } else {
      // Only show dialog if consent not already given
      setIsOpen(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    setHasConsented(true);
    setIsOpen(false);
  };

  const openConsentDialog = () => {
    setIsOpen(true);
  };

  return { hasConsented, isOpen, setIsOpen, acceptConsent, openConsentDialog };
};

interface GDPRConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const GDPRConsentDialog: React.FC<GDPRConsentDialogProps> = ({
  isOpen,
  onClose,
  onAccept
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <DialogTitle>Политика за поверителност и бисквитки</DialogTitle>
            <DialogDescription>
              Необходимо е да приемете нашите условия, за да продължите да използвате сайта
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="privacy">Политика за поверителност</TabsTrigger>
            <TabsTrigger value="cookies">Политика за бисквитки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="privacy" className="mt-2">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Политика за поверителност</h3>
                <p className="text-sm">Последна актуализация: 15 април 2025 г.</p>
                
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Spasi.bg („ние", „нас" или „наш") се ангажира да защитава поверителността на вашата информация. Настоящата Политика за поверителност обяснява как събираме, използваме и защитаваме информацията, която ни предоставяте, когато използвате нашия уебсайт.
                  </p>
                  
                  <h4 className="text-base font-medium text-foreground">Информация, която събираме</h4>
                  <p>
                    Ние събираме следните видове информация:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Лична информация, която доброволно ни предоставяте при регистрация или подаване на сигнал (име, имейл адрес, телефонен номер).</li>
                    <li>Информация за местоположение, когато подавате сигнал или докладвате опасен участък.</li>
                    <li>Информация за устройството и браузъра, които използвате за достъп до нашия сайт.</li>
                    <li>IP адрес и информация за сесията.</li>
                  </ul>
                  
                  <h4 className="text-base font-medium text-foreground">Как използваме събраната информация</h4>
                  <p>
                    Използваме вашата информация за:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Предоставяне и подобряване на нашите услуги.</li>
                    <li>Обработка и публикуване на подадените от вас сигнали.</li>
                    <li>Комуникация с вас относно сигналите и актуализациите по тях.</li>
                    <li>Изпращане на известия за важни случаи (ако сте се абонирали).</li>
                    <li>Вътрешни анализи и подобряване на платформата.</li>
                  </ul>
                  
                  <h4 className="text-base font-medium text-foreground">Съхранение на информацията</h4>
                  <p>
                    Съхраняваме вашата информация на защитени сървъри и прилагаме подходящи мерки за сигурност, за да я защитим от неоторизиран достъп, загуба или изменение.
                  </p>
                  
                  <h4 className="text-base font-medium text-foreground">Споделяне на информация</h4>
                  <p>
                    Ние не продаваме вашата лична информация на трети страни. Можем да споделяме информация в следните случаи:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>С ваше изрично съгласие.</li>
                    <li>С доверени партньори, които ни помагат с предоставянето на услугите.</li>
                    <li>Когато се изисква по закон или за защита на нашите законни права.</li>
                  </ul>
                  
                  <h4 className="text-base font-medium text-foreground">Вашите права</h4>
                  <p>
                    Съгласно GDPR, вие имате следните права:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Право на достъп до вашите лични данни.</li>
                    <li>Право на коригиране на неточни лични данни.</li>
                    <li>Право на изтриване на вашите лични данни.</li>
                    <li>Право на ограничаване на обработването.</li>
                    <li>Право на преносимост на данните.</li>
                    <li>Право на възражение срещу обработването.</li>
                  </ul>
                  
                  <h4 className="text-base font-medium text-foreground">Контакт</h4>
                  <p>
                    Ако имате въпроси относно нашата Политика за поверителност или искате да упражните някое от вашите права, моля, свържете се с нас на privacy@spasi.bg.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="cookies" className="mt-2">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Политика за бисквитки</h3>
                <p className="text-sm">Последна актуализация: 15 април 2025 г.</p>
                
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Този уебсайт използва бисквитки, за да подобри потребителското преживяване. Настоящата политика обяснява какво представляват бисквитките и как ги използваме.
                  </p>
                  
                  <h4 className="text-base font-medium text-foreground">Какво са бисквитките?</h4>
                  <p>
                    Бисквитките са малки текстови файлове, които се съхраняват на вашето устройство, когато посещавате нашия уебсайт. Те позволяват на сайта да запомни вашите действия и предпочитания за период от време, така че да не е необходимо да ги въвеждате всеки път, когато посещавате сайта.
                  </p>
                  
                  <h4 className="text-base font-medium text-foreground">Видове бисквитки, които използваме</h4>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Необходими бисквитки:</strong> Тези бисквитки са от съществено значение за работата на сайта и не могат да бъдат деактивирани. Те обикновено се задават само в отговор на действия, извършени от вас, като например настройване на предпочитания за поверителност, влизане в системата или попълване на формуляри.</li>
                    <li><strong>Функционални бисквитки:</strong> Тези бисквитки позволяват на уебсайта да предоставя подобрена функционалност и персонализация. Те могат да бъдат зададени от нас или от трети страни доставчици, чиито услуги сме добавили към нашите страници.</li>
                    <li><strong>Аналитични бисквитки:</strong> Тези бисквитки ни позволяват да броим посещенията и източниците на трафик, за да можем да измерваме и подобряваме ефективността на нашия сайт. Те ни помагат да разберем кои страници са най-популярни и да видим как посетителите се движат по сайта.</li>
                  </ul>
                  
                  <h4 className="text-base font-medium text-foreground">Как да контролирате бисквитките</h4>
                  <p>
                    Повечето уеб браузъри позволяват контрол на бисквитките чрез настройките на браузъра. Можете да настроите вашия браузър да отказва всички или някои бисквитки, или да ви предупреждава, когато уебсайтовете задават или имат достъп до бисквитки.
                  </p>
                  <p>
                    Ако деактивирате или откажете бисквитки, имайте предвид, че някои части от този уебсайт могат да станат недостъпни или да не функционират правилно.
                  </p>
                  
                  <h4 className="text-base font-medium text-foreground">Бисквитки на трети страни</h4>
                  <p>
                    Сайтът може да използва услуги на трети страни, като Google Analytics, които също използват бисквитки. Тези компании могат да използват информацията, получена чрез техните бисквитки, за да оценяват използването на нашия уебсайт, да изготвят отчети за дейността по сайта и да предоставят други услуги, свързани с дейността на уебсайта и използването на интернет.
                  </p>
                  
                  <h4 className="text-base font-medium text-foreground">Промени в политиката за бисквитки</h4>
                  <p>
                    Ние можем да актуализираме тази политика за бисквитки от време на време. Когато правим промени, ще публикуваме новата политика на тази страница и ще актуализираме датата на "последна актуализация".
                  </p>
                  
                  <h4 className="text-base font-medium text-foreground">Контакт</h4>
                  <p>
                    Ако имате въпроси относно нашата политика за бисквитки, моля, свържете се с нас на privacy@spasi.bg.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button className="w-full" onClick={onAccept} variant="default">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Приемам всички
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentDialog;
