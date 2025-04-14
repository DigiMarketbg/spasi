
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutUsSection = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="mb-8 glass rounded-xl overflow-hidden">
      <Card className="border-0 bg-transparent">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">За нас</h2>
          
          <div className="text-left space-y-4">
            <p>
              Spasi.bg е създаден с една-единствена мисия – да свързва хората, когато всяка минута е важна.
              Тази платформа не е създадена от екип или организация – зад нея стои един човек, движен изцяло от идеята да помогне.
            </p>

            <p>
              Идеята се роди от реални ситуации, в които спешна информация – като нужда от кръводарители, изчезнал човек или опасен пътен участък – беше разпръсната из различни Facebook групи и онлайн платформи. Нямаше едно място, където хората да подадат сигнал и веднага да достигнат до стотици, дори хиляди.
              Затова създадох Spasi.bg.
            </p>

            {expanded && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                    🎯 Каква е целта?
                  </h3>
                  <p>
                    Целта на платформата е проста, но мощна:
                    да свърже тези, които имат нужда от помощ – с тези, които могат да помогнат.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                    🆘 Какво можеш да направиш в Spasi.bg?
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Подадеш сигнал за помощ – за изчезнал човек, нужда от кръв, откраднат автомобил, опасен участък или друго</li>
                    <li>Абонираш се за спешни push известия – за да получаваш веднага информация, когато някой в твоя район има нужда</li>
                    <li>Видиш последните сигнали, одобрени и споделени с всички</li>
                    <li>Докладваш лоши или фалшиви сигнали</li>
                    <li>Кандидатстваш като доброволец – ако искаш да бъдеш част от мрежата за реакция</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                    🤝 Не сме институция. Не сме дарителска кампания.
                  </h3>
                  <p>
                    Spasi.bg не е свързан с правителството, не събира средства и не гарантира институционална помощ.
                    Това е място, създадено от хора – за хора.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                    📲 Защо push известия?
                  </h3>
                  <p>
                    Защото когато някой търси помощ, времето е най-важният фактор.
                    С едно съобщение, изпратено до всички абонирани потребители, можем за секунди да разпространим важна информация, която може да спаси живот, да открие човек, или да предотврати инцидент.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                    💡 Защо Spasi.bg е различен?
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Без хаос, без реклами, без разсейване</li>
                    <li>Само важна информация, подадена от реални хора</li>
                    <li>Система, в която само най-важното достига до всички</li>
                    <li>Изцяло базирано на доверие и общност</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                    🙌 Присъедини се
                  </h3>
                  <p>
                    Ако вярваш, че заедно можем да направим нещо по-добро – присъедини се към Spasi.bg.
                    Абонирай се, сподели платформата, подай сигнал – може точно твоето действие да направи разликата за някого.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />
          
          <div className="flex justify-center">
            <Button 
              variant="outline"
              className="flex items-center gap-2 transition-all"
              onClick={toggleExpanded}
            >
              {expanded ? (
                <>
                  <span>По-малко</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Виж повече</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUsSection;
