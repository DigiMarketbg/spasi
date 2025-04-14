
import React, { useState } from 'react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Info = () => {
  const currentDate = format(new Date(), 'dd.MM.yyyy', { locale: bg });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Информация</h1>
          
          <div className="glass p-6 md:p-8 rounded-xl mb-8">
            <p className="text-muted-foreground mb-6">
              Платформата Spasi.bg е създадена с цел да помогне на хората да подават и разпространяват 
              сигнали за спешни ситуации, нужди от помощ и други форми на взаимопомощ. Ние вярваме, 
              че заедно можем да помогнем на повече хора в нужда.
            </p>
          </div>
          
          <div className="glass p-6 md:p-8 rounded-xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="terms">
                <AccordionTrigger className="text-xl font-semibold">
                  Правила за ползване
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-line">
                  <div className="space-y-6 mt-4">
                    <h2 className="text-xl font-bold text-center">ПРАВИЛА ЗА ПОЛЗВАНЕ НА ПЛАТФОРМАТА SPASI.BG</h2>
                    <p className="text-sm text-center">Последна актуализация: {currentDate}</p>
                    
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-lg font-semibold">1. ОБЩА ИНФОРМАЦИЯ</h3>
                        <p>
                          Spasi.bg е платформа, създадена с цел подаване и разпространение на сигнали, свързани със спешни ситуации, нужда от помощ, опасни участъци, изчезнали хора, нужда от кръводарители и други форми на взаимопомощ.
                          Платформата не е официална институция, няма държавен характер и не е свързана с правителствени органи.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">2. РЕГИСТРАЦИЯ И ДОСТЪП</h3>
                        <p>
                          Всеки потребител има право да се регистрира и използва платформата.
                          
                          При регистрация потребителят се съгласява с настоящите правила.
                          
                          Потребителят носи отговорност за точността на предоставената от него информация.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">3. ПОДАВАНЕ НА СИГНАЛИ</h3>
                        <p>
                          Всеки регистриран потребител може да подаде сигнал.
                          
                          Платформата си запазва правото да реши дали даден сигнал ще бъде публикуван или отхвърлен, без обяснение.
                          
                          Сигнали, съдържащи фалшива информация, лични данни без съгласие, обиди, заплахи или друга забранена от закона информация, ще бъдат изтрити.
                          
                          Платформата има право да изтрива сигнали по собствена преценка, ако нарушават добрия тон или целите на сайта.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">4. ДОБРОВОЛЦИ</h3>
                        <p>
                          Потребителите могат да кандидатстват за участие като доброволци.
                          
                          Само одобрени от администратор доброволци ще имат достъп до вътрешната зона с мисии и задачи.
                          
                          Доброволците участват на собствен риск. Платформата не носи отговорност за действия извън системата.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">5. PUSH СЪОБЩЕНИЯ (ИЗВЕСТИЯ)</h3>
                        <p>
                          Потребителите могат доброволно да се абонират за известия.
                          
                          Изпращането на известия се извършва само при определени важни случаи, преценени от екипа на Spasi.bg.
                          
                          Платформата не изпраща известия по всяка подадена информация, за да се избегне претоварване на потребителите.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">6. ФАЛШИВИ СИГНАЛИ И ДОКЛАДВАНЕ</h3>
                        <p>
                          Потребителите имат възможност да докладват фалшив сигнал чрез специална функция.
                          
                          При множество доклади сигналът ще бъде прегледан от администратор, който взима крайното решение дали да бъде скрит или премахнат.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">7. ПАРТНЬОРИ И ДАРЕНИЯ</h3>
                        <p>
                          Партньори могат да подадат заявка за включване чрез формата в сайта.
                          
                          Платформата си запазва правото да одобрява и отказва партньорства.
                          
                          Даренията се използват за поддръжка, развитие и техническо обезпечаване на платформата.
                          
                          Даренията са доброволни и не гарантират специален достъп или привилегии.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">8. ОГРАНИЧЕНИЕ НА ОТГОВОРНОСТ</h3>
                        <p>
                          Spasi.bg не носи отговорност за точността на подадените сигнали от потребителите.
                          
                          Платформата не е заместител на спешните служби (като 112, полиция, пожарна и др.) и не гарантира реакция от институции.
                          
                          Използването на сайта е на собствен риск.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">9. ЛИЧНИ ДАННИ</h3>
                        <p>
                          Платформата обработва лични данни съгласно действащото българско и европейско законодателство (GDPR).
                          
                          При подаване на сигнал, потребителят се съгласява, че част от подадената информация може да бъде публично видима (например: град, описание на случая и др.).
                          
                          Телефонни номера и имейли няма да се показват публично без изрично съгласие.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">10. ПРОМЕНИ В ПРАВИЛАТА</h3>
                        <p>
                          Spasi.bg си запазва правото да променя настоящите правила по всяко време.
                          
                          Промените влизат в сила след публикуване на сайта.
                        </p>
                      </section>
                      
                      <hr className="border-border/40" />
                      
                      <section>
                        <h3 className="text-lg font-semibold">11. КОНТАКТ</h3>
                        <p>
                          Ако имате въпроси, сигнали за злоупотреба или нужда от съдействие, можете да се свържете с нас чрез контактната форма на сайта или имейл: contact@spasi.bg
                        </p>
                      </section>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Info;
