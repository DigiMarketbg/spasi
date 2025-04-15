
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake, AlertTriangle, Shield } from 'lucide-react';

const PlatformDescription = () => {
  return (
    <div className="glass p-6 md:p-8 rounded-xl mb-8">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">За платформата Spasi.bg</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Създадена с мисията да свързва хора в нужда с тези, които могат да помогнат
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start space-x-4 pb-2">
              <HeartHandshake className="h-5 w-5 text-primary mt-1" />
              <div>
                <CardTitle className="text-lg font-semibold">Нашата мисия</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Платформата Spasi.bg е създадена с цел да помогне на хората да подават и разпространяват 
                сигнали за спешни ситуации, нужди от помощ и други форми на взаимопомощ. Ние вярваме, 
                че заедно можем да помогнем на повече хора в нужда.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start space-x-4 pb-2">
              <AlertTriangle className="h-5 w-5 text-spasi-red mt-1" />
              <div>
                <CardTitle className="text-lg font-semibold">Как работи</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Регистрирайте се и подайте сигнал, който ще бъде проверен от нашите модератори.
                След одобрение, Вашият сигнал става видим за всички потребители и доброволци в платформата,
                които могат да се свържат с Вас и да предложат помощ.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start space-x-4 pb-2">
              <Shield className="h-5 w-5 text-spasi-green mt-1" />
              <div>
                <CardTitle className="text-lg font-semibold">Общност</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Присъединете се към нашата нарастваща общност от доброволци, партньори и 
                спасители. Заедно можем да направим България по-безопасна и солидарна.
                Всеки сигнал е важен и всяка помощ е от значение.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="bg-muted/30 p-4 md:p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">За кого е предназначена платформата</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Хора в нужда</h4>
                <p className="text-sm text-muted-foreground">
                  Ако се нуждаете от помощ - от спешна ситуация до всекидневна нужда, 
                  можете да подадете сигнал, който ще достигне до хората, които могат да помогнат.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Доброволци</h4>
                <p className="text-sm text-muted-foreground">
                  Ако искате да помагате на хора в нужда, можете да се регистрирате като доброволец
                  и да откликвате на сигнали според Вашите умения и възможности.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDescription;
